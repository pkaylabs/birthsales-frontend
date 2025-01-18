import React, { JSX, ReactHTMLElement, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Countdown from "./countdown";

interface CarouselProps {
  type?: string;
  itemsPerView: number;
  title?: string;
  showCountdown?: boolean;
  showControls?: boolean;
  showViewAll?: boolean;
  items: (() => JSX.Element)[]; // Array of functions returning JSX elements
}

const CardCarousel: React.FC<CarouselProps> = ({
  type,
itemsPerView,
  title,
  showControls,
  showCountdown,
    showViewAll,
  items,
}) => {
  const [startIndex, setStartIndex] = useState(0);
//   const itemsPerView = itemsPerView;

  const nextSlide = () => {
    setStartIndex((prevIndex) =>
      prevIndex + itemsPerView >= items.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setStartIndex((prevIndex) =>
      prevIndex === 0 ? items.length - itemsPerView : prevIndex - 1
    );
  };

  const getVisibleItems = () => {
    const visibleItems = [];
    for (let i = 0; i < itemsPerView; i++) {
      visibleItems.push(items[(startIndex + i) % items.length]);
    }
    return visibleItems;
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => nextSlide(),
    onSwipedRight: () => prevSlide(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const conditionalHandlers = showControls ? { ...handlers } : {};

  return (
    <div className="select-none w-full">
      <div className="flex items-center space-x-3">
        <div className="w-5 h-10 bg-[#DB4444] rounded-md " />
        <p className="font-semibold text-base text-[#DB4444] ">{type}</p>
      </div>

      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex items-end space-x-20">
          <h2 className="font-semibold text-4xl text-balck ">{title}</h2>

          {/* countdown */}
          {showCountdown && <Countdown endDateTime="2025-01-20T23:59:59" />}
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex space-x-2 mb-4">
            <button
              onClick={prevSlide}
              className="w-12 h-12 bg-gray-100 flex justify-center items-center text-black rounded-full hover:bg-gray-300"
            >
              <GoArrowLeft className="size-5 " aria-hidden="true" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 bg-gray-100 flex justify-center items-center text-black rounded-full hover:bg-gray-300"
            >
              <GoArrowRight className="size-5 " aria-hidden="true" />
            </button>
          </div>
        )}

        {/* View All Button */}
        {showViewAll && (
          <button className="font-medium w-40 h-12 flex justify-center items-center bg-[#DB4444] rounded-md text-white text-base">
            View All 
          </button>
        )}
      </div>

      {/* Carousel Content */}
      <div className="w-full flex overflow-hidden" {...conditionalHandlers}>
        <div
          className="w-full flex justify-between transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${
              ((startIndex % items.length) * 100) / itemsPerView
            }%)`,
          }}
        >
          {getVisibleItems().map((item, index) => (
            <>{item()}</>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
