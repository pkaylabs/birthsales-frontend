import React from "react";
import WishCard from "./components/WishCard";
import ProductCard from "../home/components/cards/product";

const WishList = () => {
  return (
    <div className="max-w-[80rem] m-auto mt-5">
      {/* wishlist */}
      <div className="flex flex-col  gap-5 mb-5">
        {/* Headers */}
        <div className="flex justify-between items-center">
          <h1 className="">WishList (4)</h1>
          <button className="p-2 border border-gray-300 rounded-md">
            Move All To Bag
          </button>
        </div>
        {/* wishcards */}
        <div className="flex justify-between w-full slide-up">
          <WishCard
            price={"$600"}
            title={"RGB liquid CPU Cooler"}
            img={
              "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
          <WishCard
            price={"$450"}
            title={"Gucci duffle bag"}
            img={
              "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
          <WishCard
            price={"$550"}
            title={"GP11 Shooter USB Gamepad"}
            img={
              "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
          <WishCard
            price={"$750"}
            title={"Quilted Satin Jacket"}
            img={
              "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
          />
        </div>
      </div>
      {/* just for you */}
      <div className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center justify-between gap-2">
            <div className="w-4 bg-red h-8 rounded-md"></div>
            <h1 className="">Just For You</h1>
          </div>
          <button className="p-2 border border-gray-300 rounded-md">
            See All
          </button>
        </div>
        {/* wishcards */}
        <div className="flex justify-between gap-5 slide-up">
          <WishCard
            price={"$960"}
            title={"ASUS FHD Gaming Laptop"}
            img={
              "https://media.istockphoto.com/id/1542566108/photo/young-businessman-smiling-at-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmImvJ9PG_lr7XTm2cgStbBE2TT55D4rh-zz4qc_1l0="
            }
          />
          <WishCard
            price={"$450"}
            title={"IPS LCD Gaming Monitor"}
            img={
              "https://media.istockphoto.com/id/1542566108/photo/young-businessman-smiling-at-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmImvJ9PG_lr7XTm2cgStbBE2TT55D4rh-zz4qc_1l0="
            }
          />
          <WishCard
            price={"$550"}
            title={"HAVIT HV-G92 Gamepad"}
            img={
              "https://media.istockphoto.com/id/1542566108/photo/young-businessman-smiling-at-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmImvJ9PG_lr7XTm2cgStbBE2TT55D4rh-zz4qc_1l0="
            }
          />
          <WishCard
            price={"$750"}
            title={"AK-900 Wired Keyboard"}
            img={
              "https://media.istockphoto.com/id/1542566108/photo/young-businessman-smiling-at-camera.webp?a=1&b=1&s=612x612&w=0&k=20&c=wmImvJ9PG_lr7XTm2cgStbBE2TT55D4rh-zz4qc_1l0="
            }
          />
        </div>
      </div>
    </div>
  );
};

export default WishList;
