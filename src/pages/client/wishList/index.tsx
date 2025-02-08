import React from "react";
import CardCarousel from "../home/components/cards-carousel";
import ProductCard from "../home/components/cards/product";

const WishList = () => {
  const productCards = [ProductCard];

  return (
    <div className="max-w-[80rem] m-auto mt-5">
      {/* wishlist */}
      <CardCarousel
        type="Wishlist"
        itemsPerView={4}
        title="Your WishList"
        showViewAll
        items={productCards}
      />
    </div>
  );
};

export default WishList;
