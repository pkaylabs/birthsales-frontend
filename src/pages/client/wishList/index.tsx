import React from "react";
import CardCarousel from "../home/components/cards-carousel";
import ProductCard from "../home/components/cards/product";

const WishList = () => {
  const productCards = [ProductCard, ProductCard, ProductCard, ProductCard, ProductCard];

  return (
    <div className="max-w-[80rem] mx-5 md:mx-5 lg:mx-auto slide-up">
      {/* wishlist */}
      <CardCarousel
        type="Wishlist"
        title="Your WishList"
        showViewAll
        items={productCards}
      />
    </div>
  );
};

export default WishList;
