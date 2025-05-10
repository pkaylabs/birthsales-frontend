import React, { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import Countdown from "./countdown";

interface CarouselProps {
  type?: string;
  title?: string;
  showCountdown?: boolean;
  showControls?: boolean;
  showViewAll?: boolean;
  items: Array<React.ReactNode | null | undefined>;
  onViewAll?: () => void;
}

const CardCarousel: React.FC<CarouselProps> = ({
  type,
  title,
  showControls = false,
  showCountdown = false,
  showViewAll = false,
  items,
  onViewAll,
}) => {
  // filter out null/undefined
  const validItems = items.filter((i): i is React.ReactNode => Boolean(i));
  const total = validItems.length;

  // slides visible
  const [perView, setPerView] = useState(4);
  const [start, setStart] = useState(0);

  // responsive per-view
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setPerView(1);
      else if (w < 1024) setPerView(2);
      else if (w < 1280) setPerView(3);
      else setPerView(4);
      setStart(0);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const isFirst = start === 0;
  const isLast = start >= total - perView;

  const next = () => {
    if (!isLast) setStart((s) => s + 1);
  };
  const prev = () => {
    if (!isFirst) setStart((s) => s - 1);
  };

  const swipe = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    trackMouse: true,
  });

  return (
    <div className="w-full select-none">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-end space-x-3">
          {type && (
            <>
              <div className="bg-[#DB4444] rounded w-2 h-6 sm:w-3 sm:h-8" />
              <p className="text-[#DB4444] font-semibold text-sm sm:text-base">
                {type}
              </p>
            </>
          )}
          {showCountdown && <Countdown endDateTime="2025-01-20T23:59:59" />}
        </div>

        <div className="flex items-center space-x-2">
          {showViewAll && onViewAll && (
            <button
              onClick={onViewAll}
              className="bg-[#DB4444] text-white rounded-md text-xs sm:text-sm px-2 sm:px-4 py-1"
            >
              View All
            </button>
          )}
          {showControls && (
            <>
              <button
                onClick={prev}
                disabled={isFirst}
                className={`p-2 bg-gray-100 rounded-full shadow ${
                  isFirst
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-200"
                }`}
                aria-label="Previous"
              >
                <GoArrowLeft />
              </button>
              <button
                onClick={next}
                disabled={isLast}
                className={`p-2 bg-gray-100 rounded-full shadow ${
                  isLast ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
                }`}
                aria-label="Next"
              >
                <GoArrowRight />
              </button>
            </>
          )}
        </div>
      </div>

      {/* slides */}
      <div className="overflow-hidden" {...(showControls ? swipe : {})}>
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            width: `${(100 * total) / perView}%`,
            transform: `translateX(-${(100 * start) / total}%)`,
          }}
        >
          {validItems.map((child, i) => (
            <div
              key={i}
              className="flex-shrink-0"
              style={{ width: `${100 / total}%` }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardCarousel;
