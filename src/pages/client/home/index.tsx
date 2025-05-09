import React, { useState } from "react";
import speaker from "@/assets/images/speaker.png";
import {
  useGetHomePageDataQuery,
  useSearchProductsQuery,
} from "@/redux/features/homepage/homepageApiSlice";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { BASE_URL } from "@/constants";
import CardCarousel from "./components/cards-carousel";
import ProductCard from "./components/cards/product";
import Carousel from "./components/swiper";
import CategoryCard from "./components/cards/category";
import Countdown from "./components/countdown";
import BottomCards from "./components/bottom-cards";

const Home: React.FC = () => {
  const { data, isLoading, isError } = useGetHomePageDataQuery();
  const [search, setSearch] = useState("");
  const { data: searchResults = [], isFetching: isSearching } =
    useSearchProductsQuery(search, {
      skip: search.trim().length === 0,
    });

  // track which section is expanded
  const [expandedSection, setExpandedSection] = useState<
    "flash" | "categories" | "best" | null
  >(null);

  if (isLoading) {
    return (
      <Box className="p-8 flex justify-center">
        <CircularProgress />
      </Box>
    );
  }
  if (isError || !data) {
    return <Box className="p-8 text-red-500">Error loading home page.</Box>;
  }

  const allProducts = data.products;
  const allCategories = data.categories;
  const bestSellers = data.best_selling_products;

  const renderCarousel = (
    section: "flash" | "categories" | "best",
    title: string,
    items: any[],
    renderFn: (item: any) => React.ReactNode
  ) => {
    // if expanded, show full-width responsive grid
    if (expandedSection === section) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((i) => renderFn(i))}
        </div>
      );
    }

    // otherwise carousel
    return (
      <CardCarousel
        type={title}
        title={title}
        showControls
        showViewAll
        onViewAll={() => setExpandedSection(section)}
        items={items.map((i) => renderFn(i))}
      />
    );
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-8">
      {/* search */}
      <Box className="py-4">
        <TextField
          fullWidth
          placeholder="Search products, categories, descriptions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ sx: { borderRadius: 1 } }}
        />
      </Box>

      {/* search results */}
      {search.trim() ? (
        <Box>
          {isSearching ? (
            <Box className="flex justify-center py-8">
              <CircularProgress />
            </Box>
          ) : !searchResults.length ? (
            <Typography className="text-center py-8">
              No results for “{search}”
            </Typography>
          ) : (
            renderCarousel(
              "best",
              `Results for “${search}”`,
              searchResults,
              (p) => <ProductCard key={p.id} product={p} />
            )
          )}
        </Box>
      ) : (
        <>
          {/* hero slider */}
          <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden shadow-lg mb-12">
            <Carousel
              banners={data.banners}
              autoPlay
              autoPlayInterval={10000}
            />
          </div>

          {/* flash sales */}
          <section className="mb-12">
            {renderCarousel("flash", "Flash Sales", allProducts, (p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </section>

          {/* categories */}
          <section className="mb-12">
            {renderCarousel(
              "categories",
              "Browse By Categories",
              allCategories,
              (c) => (
                <CategoryCard
                  key={c.id}
                  description={c.description}
                  id={c.id}
                  name={c.name}
                  image={c.image}
                />
              )
            )}
          </section>

          {/* best sellers */}
          <section className="mb-12">
            {renderCarousel(
              "best",
              "Best Selling Products",
              bestSellers,
              (p) => (
                <ProductCard key={p.id} product={p} />
              )
            )}
          </section>

          {/* promo banner */}
          <section className="mb-12 p-6 bg-black rounded-lg flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-1 text-center lg:text-left space-y-4">
              <p className="text-green-400 uppercase text-sm">Categories</p>
              <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-5xl">
                Enhance Your <br /> Music Experience
              </h1>
              <div className="hidden md:block">
                <Countdown showInCat endDateTime="2025-01-20T23:59:59" />
              </div>
              <button className="bg-green-400 text-black font-medium rounded-md px-6 py-2">
                Buy Now!
              </button>
            </div>
            <div className="flex-1">
              <img
                src={speaker}
                alt="speaker"
                className="w-full h-auto object-contain"
              />
            </div>
          </section>

          {/* new arrivals */}
          <section className="mb-12">
            <div className="mb-6">
              <div className="flex items-center space-x-2">
                <div className="bg-red-600 w-2 h-8 rounded" />
                <p className="text-red-600 font-semibold">Featured</p>
              </div>
              <h2 className="font-semibold text-xl sm:text-2xl lg:text-4xl">
                New Arrival
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.new_arrivals.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded overflow-hidden h-64 sm:h-80"
                >
                  <img
                    src={`${BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent text-white">
                    <h5 className="font-semibold text-lg">{item.name}</h5>
                    <p className="text-sm">{item.description}</p>
                    <button className="mt-2 underline">Shop Now</button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* bottom cards */}
          <section className="mb-8">
            <BottomCards />
          </section>
        </>
      )}
    </main>
  );
};

export default Home;
