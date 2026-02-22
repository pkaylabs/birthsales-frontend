import React, { useEffect, useState } from "react";
import { Link, useMatch } from "react-location";
import { IoStar } from "react-icons/io5";
import { MdOutlineFavoriteBorder } from "react-icons/md";
// import { TbTruckDelivery } from "react-icons/tb";
// import { GrPowerCycle } from "react-icons/gr";
import { motion } from "framer-motion";
import {
  useGetProductImagesQuery,
  useGetProductQuery,
} from "@/redux/features/products/productsApi";
import { Box, CircularProgress } from "@mui/material";
import { useAppDispatch } from "@/redux";
import { addToCart } from "@/redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import {
  resolveImageUrl,
  resolveProductImageUrl,
} from "@/utils/resolve-image-url";

const ProductDetails: React.FC = () => {
  const dispatch = useAppDispatch();
  const { params } = useMatch();
  const prodId = Number(params.id);
  const { data: product, isLoading, isError } = useGetProductQuery(prodId);
  const { data: productImages } = useGetProductImagesQuery(prodId, {
    skip: !Number.isFinite(prodId) || prodId <= 0,
  });

  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  useEffect(() => {
    if (!product) return;

    const collectStrings = (v: unknown): string[] => {
      if (typeof v === "string") return [v];
      if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string");
      return [];
    };

    const raw = (product as unknown as { image?: unknown }).image;
    const rawMain = (product as unknown as { main_image_url?: unknown; image_url?: unknown })
      .main_image_url;
    const rawMainAlt = (product as unknown as { image_url?: unknown }).image_url;

    const fromProduct = [
      ...collectStrings(rawMain),
      ...collectStrings(rawMainAlt),
      ...collectStrings(raw),
      ...collectStrings((product as unknown as { images?: unknown }).images),
      ...collectStrings((product as unknown as { extra_images?: unknown }).extra_images),
      ...collectStrings(
        (product as unknown as { additionalImages?: unknown }).additionalImages
      ),
    ];

    const fromEndpoint = Array.isArray(productImages)
      ? productImages
          .flatMap((img) => {
            const rec = img as unknown as Record<string, unknown>;
            const url = rec["url"];
            const image = rec["image"];
            return [...collectStrings(url), ...collectStrings(image)];
          })
          .filter((s) => typeof s === "string")
      : [];

    const deduped = Array.from(
      new Set(
        [...fromProduct, ...fromEndpoint]
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      )
    );

    setGallery(deduped);
    setSelectedImage((prev) => {
      if (prev && deduped.includes(prev)) return prev;
      return deduped[0] ?? "";
    });

    setSelectedColor("");
    setSelectedSize("");
  }, [product, productImages]);

  const mainImageSrc = selectedImage
    ? resolveImageUrl(selectedImage)
    : resolveProductImageUrl(product);

  const handleAddToCart = () => {
    if (!product) return toast.error("Product unavailable");

    const availableColors = Array.isArray((product as any).available_colors)
      ? ((product as any).available_colors as string[]).filter(
          (c) => typeof c === "string" && c.trim().length > 0
        )
      : [];
    const availableSizes = Array.isArray((product as any).available_sizes)
      ? ((product as any).available_sizes as string[]).filter(
          (s) => typeof s === "string" && s.trim().length > 0
        )
      : [];

    if (!product.in_stock) {
      toast.error("This product is out of stock");
      return;
    }

    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    dispatch(
      addToCart({
        product,
        quantity: 1,
        color: selectedColor || undefined,
        size: selectedSize || undefined,
      })
    );
    toast.success(`Added "${product.name}" to cart`);
  };

  if (isLoading) {
    return (
      <Box className="p-8 flex justify-center">
        <CircularProgress />
      </Box>
    );
  }
  if (isError || !product) {
    return (
      <Box className="p-8 text-red-500">Unable to load product #{prodId}.</Box>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-6 flex flex-wrap gap-1">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Thumbnails */}
        {gallery.length > 1 && (
          <div className="flex md:flex-col overflow-x-auto md:overflow-visible space-x-2 md:space-x-0 md:space-y-2">
            {gallery.map((img, idx) => (
              <motion.div
                key={idx}
                onClick={() => setSelectedImage(img)}
                className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-md cursor-pointer border ${
                  img === selectedImage
                    ? "border-rose-500"
                    : "border-gray-200"
                } overflow-hidden`}
                whileHover={{ scale: 1.05 }}
              >
                <img
                  src={resolveImageUrl(img)}
                  alt={`thumb-${idx}`}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Main Image */}
        <motion.div
          key={selectedImage}
          className="flex-1 bg-gray-100 rounded-lg flex items-center justify-center p-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <img
            src={mainImageSrc}
            alt={product.name}
            className="max-w-full max-h-96 object-contain"
          />
        </motion.div>
      </div>

      {/* Details */}
      <div className="mt-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-semibold">{product.name}</h1>
        <h2 className="text-2xl md:text-3xl text-gray-400 font-semibold">{product.vendor_name}</h2>
        <div className="flex items-center space-x-4">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <IoStar
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(product.rating ?? 0)
                    ? "text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-gray-500">
            ({(product as any).ratings_count ?? product.reviews_count ?? 0} reviews)
          </span>
          <span className="text-green-600 font-medium">
            {product.in_stock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <p className="text-2xl font-bold">GHC{product.price}</p>
        <p className="text-gray-700">{product.description || "No description available."}</p>

        {Array.isArray(product.available_colors) &&
          product.available_colors.filter((c) => (c ?? "").trim().length > 0)
            .length > 0 && (
            <div>
              <div className="font-medium mb-2">Color</div>
              <div className="flex flex-wrap gap-2">
                {product.available_colors
                  .filter((c) => (c ?? "").trim().length > 0)
                  .map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`px-3 py-1 rounded border text-sm transition ${
                        selectedColor === c
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
              </div>
            </div>
          )}

        {Array.isArray(product.available_sizes) &&
          product.available_sizes.filter((s) => (s ?? "").trim().length > 0)
            .length > 0 && (
            <div>
              <div className="font-medium mb-2">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.available_sizes
                  .filter((s) => (s ?? "").trim().length > 0)
                  .map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1 rounded border text-sm transition ${
                        selectedSize === s
                          ? "border-rose-500 bg-rose-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
              </div>
            </div>
          )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-lg transition"
          >
            Add to Cart
          </button>
          <button className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-lg flex items-center justify-center">
            <MdOutlineFavoriteBorder className="mr-2" /> Add to Wishlist
          </button>
        </div>

        {/* Delivery & Returns */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 border-t pt-6">
          <div className="flex items-start space-x-3">
            <TbTruckDelivery className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <h3 className="font-medium">Free & Fast Delivery</h3>
              <Link to="#" className="text-sm text-rose-500 underline">
                Check availability
              </Link>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <GrPowerCycle className="w-6 h-6 text-gray-600 mt-1" />
            <div>
              <h3 className="font-medium">30-Day Returns</h3>
              <Link to="#" className="text-sm text-rose-500 underline">
                Learn more
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </main>
  );
};

export default ProductDetails;

