// export default CardCarousel;
import React, {  useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Countdown from "./countdown";

interface CarouselProps {
  type?: string;
  title?: string;
  showCountdown?: boolean;
  showControls?: boolean;
  showViewAll?: boolean;
  items: Array<React.ReactNode | null | undefined>; // Array of functions returning JSX elements
}

const CardCarousel: React.FC<CarouselProps> = ({
  type,
  title,
  showControls,
  showCountdown,
  showViewAll,
  items,
}) => {
  const [itemsPerView, setItemsPerView] = useState(4); // Number of items visible at one time

  const [startIndex, setStartIndex] = useState(0);

  // Update itemsPerView based on current screen width using your custom breakpoints
  useEffect(() => {
    const handleResize = () => {
      // Example breakpoints: adjust these values to match your Tailwind config
      if (window.innerWidth < 635) {
        // Mobile breakpoint
        setItemsPerView(1);
      } else if (window.innerWidth < 1200) {
        // Tablets breakpoint
        setItemsPerView(2);
      } else {
        // Desktop breakpoint
        setItemsPerView(4);
      }
      // Reset the start index if necessary
      setStartIndex(0);
    };

    handleResize(); // initial check

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Check if we've reached the last slide.
  const isLastSlide = startIndex >= items.filter(Boolean).length - itemsPerView;
  const isFirstSlide = startIndex === 0;

  const nextSlide = () => {
    // Only update if we haven't reached the last slide
    if (!isLastSlide) {
      setStartIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    // Only update if we aren't on the first slide
    if (!isFirstSlide) {
      setStartIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Render all items in a flex container so that sliding shows the extra product
  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const conditionalHandlers = showControls ? { ...handlers } : {};

  const validItems = items.filter((item): item is React.ReactNode =>
    Boolean(item)
  );

  return (
    <div className="select-none w-full">
      <div className="flex items-center space-x-3 mobile:space-x-2 tablet:space-x-3">
        <div className=" bg-[#DB4444] rounded-md w-3 h-8 md:w-5 md:h-10" />
        <p className="font-semibold text-[#DB4444] text-base md:text-xl">
          {type}
        </p>
      </div>

      <div className="w-full flex justify-between items-center mb-8">
        <div className="flex items-end  space-x-10 md:space-x-16 lg:space-x-20">
          <h2 className="font-semibold text-balck text-xl md:text-2xl lg:text-3xl xl:text-4xl">
            {title}
          </h2>

          {showCountdown && <Countdown endDateTime="2025-01-20T23:59:59" />}
        </div>

        {showControls && (
          <div className="space-x-2 mb-4 hidden md:flex lg:flex lg:space-x-2">
            <button
              onClick={prevSlide}
              disabled={isFirstSlide}
              className={`w-12 h-12 bg-gray-100 flex justify-center items-center text-black rounded-full hover:bg-gray-300 ${
                isFirstSlide && "opacity-50 cursor-not-allowed"
              }`}
            >
              <GoArrowLeft aria-hidden="true" />
            </button>
            <button
              onClick={nextSlide}
              disabled={isLastSlide}
              className={`w-12 h-12 bg-gray-100 flex justify-center items-center text-black rounded-full hover:bg-gray-300 ${
                isLastSlide && "opacity-50 cursor-not-allowed"
              }`}
            >
              <GoArrowRight aria-hidden="true" />
            </button>
          </div>
        )}

        {showViewAll && (
          <button className="font-medium lg:w-40 lg:h-12 lg:text-lg flex justify-center items-center bg-[#DB4444] rounded-md text-white text-base w-32 h-8 text-[12px] md:w-36 md:h-10">
            View All
          </button>
        )}
      </div>

      <div className="w-full overflow-hidden" {...conditionalHandlers}>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${(startIndex * 100) / itemsPerView}%)`,
          }}
        >
          {validItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / itemsPerView}%` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
