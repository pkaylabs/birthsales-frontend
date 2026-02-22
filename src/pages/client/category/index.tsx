import React, { useMemo, useState } from "react";
import { useMatch, useNavigate } from "react-location";
import { Box, CircularProgress } from "@mui/material";
import { useGetProductsQuery } from "@/redux/features/products/productsApi";
import { useGetCategoriesQuery } from "@/redux/features/category/productCategoryApiSlice";
import type { Product } from "@/redux/type";
import ProductCard from "@/pages/client/home/components/cards/product";

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating-desc" | "name-asc";

const CategoryProductsPage: React.FC = () => {
  const navigate = useNavigate();
  const { params } = useMatch();
  const categoryId = String(params.id ?? "");

  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [query, setQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("relevance");

  const categoryName = useMemo(() => {
    const found = categories.find((c) => String(c.id) === categoryId);
    return found?.name ?? `Category ${categoryId}`;
  }, [categories, categoryId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = products.filter((p) => String(p.category) === categoryId);

    if (inStockOnly) {
      list = list.filter((p) => !!p.in_stock);
    }

    if (q) {
      list = list.filter((p) => {
        const name = String(p.name ?? "").toLowerCase();
        const desc = String(p.description ?? "").toLowerCase();
        return name.includes(q) || desc.includes(q);
      });
    }

    const withNumber = (v: unknown, fallback = 0) => {
      const n = typeof v === "number" ? v : Number(v);
      return Number.isFinite(n) ? n : fallback;
    };

    const safeSort = (items: Product[]) => {
      switch (sort) {
        case "price-asc":
          return [...items].sort((a, b) => withNumber(a.price) - withNumber(b.price));
        case "price-desc":
          return [...items].sort((a, b) => withNumber(b.price) - withNumber(a.price));
        case "rating-desc":
          return [...items].sort(
            (a, b) => withNumber(b.rating) - withNumber(a.rating)
          );
        case "name-asc":
          return [...items].sort((a, b) =>
            String(a.name ?? "").localeCompare(String(b.name ?? ""))
          );
        case "relevance":
        default:
          return items;
      }
    };

    return safeSort(list);
  }, [products, categoryId, query, inStockOnly, sort]);

  if (isLoading) {
    return (
      <Box className="p-8 flex justify-center">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return <Box className="p-8 text-red-500">Unable to load products.</Box>;
  }

  return (
    <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-8">
      <nav className="text-gray-500 text-sm mb-6 flex flex-wrap gap-1">
        <span
          className="hover:underline cursor-pointer"
          onClick={() => navigate({ to: "/" })}
        >
          Home
        </span>
        <span>/</span>
        <span className="text-gray-900 font-medium">{categoryName}</span>
      </nav>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-900">{categoryName}</h1>
          <p className="text-sm text-gray-500">
            {filtered.length} product{filtered.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-72">
            <label className="block text-xs text-gray-600 mb-1">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded px-3 py-2"
              type="text"
            />
          </div>

          <div className="w-full sm:w-48">
            <label className="block text-xs text-gray-600 mb-1">Sort</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              aria-label="Sort"
            >
              <option value="relevance">Relevance</option>
              <option value="name-asc">Name (A–Z)</option>
              <option value="price-asc">Price (Low–High)</option>
              <option value="price-desc">Price (High–Low)</option>
              <option value="rating-desc">Rating (High–Low)</option>
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700 mt-6 sm:mt-0">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="accent-[#DB4444]"
            />
            In stock only
          </label>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="p-8 text-center text-gray-500 border border-dashed rounded">
          No products found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
};

export default CategoryProductsPage;
