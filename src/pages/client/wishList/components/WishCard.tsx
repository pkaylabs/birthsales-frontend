// import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { FC } from "react";

const WishCard = ({
  img,
  title,
  price,
}: {
  img: string;
  title: string;
  price: string;
}) => {
  return (
    <div className="w-[17rem] py-4 mb-6 rounded-xl relative hover:scale-90 tranform transition-transform duration-500 ease-in-out">
      <img
        className="w-[700px] h-[150px] object-contain rounded-md bg-[#F5F5F5]"
        src={img}
      />
      <button className="flex items-center justify-center w-full text-white bg-black rounded-b-md mb-2 p-2">
        <FontAwesomeIcon icon={faShoppingCart} />
        <span className="ml-2">Add To Cart</span>
      </button>
      <p>{title}</p>
      <p className="text-rose-400">{price}</p>
      <button className="absolute top-5 right-5 bg-white p-2 rounded-full items-center py-1">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

export const withLabel = (WishCard: FC) => {
    return (props) => {
        return (
            <div className="relative">
                <label className="absolute">-35%</label>
                <WishCard {...props}/>
            </div>
        )
    }
}

export default WishCard;
