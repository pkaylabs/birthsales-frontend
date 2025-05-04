
import React, { useState } from "react";
import CardCarousel from "./components/cards-carousel";
import CategoryCard from "./components/cards/category";
import ProductCard from "./components/cards/product";
import Countdown from "./components/countdown";
import Carousel from "./components/swiper";
import BottomCards from "./components/bottom-cards";
import speaker from "@/assets/images/speaker.png";
import {
  useGetHomePageDataQuery,
  useSearchProductsQuery,
} from "@/redux/features/homepage/homepageApiSlice";
import { Box, CircularProgress, TextField, Typography } from "@mui/material";
import { Category, Product } from "@/redux/type";
import { BASE_URL } from "@/constants";

const Home = () => {
  // 1️⃣ homepage data
  const { data, isLoading, isError } = useGetHomePageDataQuery();

  // 2️⃣ live‐search state + RTK Query hook
  const [search, setSearch] = useState("");
  const { data: searchResults = [], isFetching: isSearching } =
    useSearchProductsQuery(search, {
      skip: search.trim().length === 0,
    });

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

  const renderCarousel = (title: string, items: Product[]) => (
    <CardCarousel
      type={title}
      title={title}
      showControls
      showViewAll
      items={items.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    />
  );

  return (
    <main className="w-full max-w-[80rem] mx-auto px-4 large-screen:px-8">
      {/*SEARCH BAR */}
      <Box className="py-6">
        <TextField
          fullWidth
          placeholder="Search products, categories, descriptions…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ sx: { borderRadius: 1 } }}
        />
      </Box>

      {/* If there's a search term, show those results */}
      {search.trim().length > 0 ? (
        <Box>
          {isSearching ? (
            <Box className="flex justify-center py-8">
              <CircularProgress />
            </Box>
          ) : searchResults.length === 0 ? (
            <Typography className="text-center py-8">
              No results for “{search}”
            </Typography>
          ) : (
            renderCarousel(`Results for “${search}”`, searchResults)
          )}
        </Box>
      ) : (
        <>
          {/* BANNERS */}
          <header className="flex mobile:flex-col desktop-up:flex-row">
            <div className="w-full desktop-up:w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-lg shadow-lg">
              <Carousel
                banners={data.banners}
                autoPlay
                autoPlayInterval={10000}
              />
            </div>
          </header>

          {/* FLASH SALES */}
          <section className="my-12">
            {renderCarousel("Flash Sales", data.products)}
            <Box className="mt-6 flex justify-center">
              <button className="bg-[#DB4444] text-white rounded-md w-32 h-8 text-[12px] md:w-48 md:h-10 lg:w-64 lg:h-12 xl:w-72 xl:h-14 xl:text-lg">
                View All Products
              </button>
            </Box>
          </section>

          {/* CATEGORIES */}
          <section className="my-12">
            <CardCarousel
              type="Categories"
              title="Browse By Categories"
              showControls
              items={data.categories.map((cat: Category) => (
                <CategoryCard
                  key={cat.id}
                  id={cat.id}
                  name={cat.name}
                  image={cat.image}
                  description={cat.description}
                />
              ))}
            />
          </section>

          {/* BEST SELLERS */}
          <section className="my-12">
            {renderCarousel(
              "Best Selling Products",
              data.best_selling_products
            )}
          </section>

          {/* PROMO BANNER */}
          <section className="my-12 p-8 large-screen:p-12 bg-black flex mobile:flex-col tablet:flex-row large-screen:flex-row items-center gap-6">
            <div className="flex-1 flex flex-col space-y-10 tablet:space-y-8 large-screen:space-y-10">
              <p className="text-[#00FF66] uppercase">Categories</p>
              <h1 className="font-semibold text-white text-4xl leading-[55px] md:text-3xl lg:text-5xl xl:text-6xl">
                Enhance Your <br /> Music Experience
              </h1>
              <div className="mobile:hidden tablet:block large-screen:block">
                <Countdown showInCat endDateTime="2025-01-20T23:59:59" />
              </div>
              <button className="bg-[#00FF66] text-white font-medium rounded-md mobile:w-20 mobile:h-8 mobile:text-[12px] tablet:w-32 tablet:h-10 desktop:w-44 desktop:h-14 large-screen:w-48 large-screen:h-16">
                Buy Now!
              </button>
            </div>
            <div className="flex-1">
              <img
                src={speaker}
                alt="speaker"
                className="object-contain w-full h-auto"
              />
            </div>
          </section>

          {/* OUR PRODUCTS */}
          <section className="my-12">
            {renderCarousel("Explore Our Products", data.products)}
            <Box className="mt-6 flex justify-center">
              <button className="bg-[#DB4444] text-white rounded-md w-32 h-8 text-[12px] md:w-48 md:h-10 lg:w-64 lg:h-12 xl:w-72 xl:h-14 xl:text-lg">
                View All Products
              </button>
            </Box>
          </section>

          {/* NEW ARRIVAL */}
          <section className="my-12">
            <div className="mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-[#DB4444] rounded-md w-3 h-8 md:w-5 md:h-10" />
                <p className="font-semibold text-[#DB4444] text-base md:text-xl">
                  Featured
                </p>
              </div>
              <h2 className="font-semibold text-balck text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                New Arrival
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
              {data.new_arrivals.map((item, idx) => (
                <div
                  key={idx}
                  className="relative bg-black rounded overflow-hidden md:h-[400px] lg:h-[500px]"
                >
                  <img
                    src={`${BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                    <h5 className="font-semibold text-2xl">{item.name}</h5>
                    <p className="text-sm">{item.description}</p>
                    <button className="mt-2 border-b border-white">
                      Shop Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BOTTOM CARDS */}
          <section className="my-8">
            <BottomCards />
          </section>
        </>
      )}
    </main>
  );
};

export default Home;
