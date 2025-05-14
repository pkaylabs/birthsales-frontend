import { BASE_URL } from "@/constants";
import { Banner } from "@/redux/type";
import React, { useEffect, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useSwipeable } from "react-swipeable";

interface CarouselProps {
  banners: Banner[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showDots?: boolean;
  showControls?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  banners = [],
  autoPlay = false,
  autoPlayInterval = 10000,
  showDots = true,
  showControls = true,
}) => {
  const activeBanners = banners.filter((b) => b.is_active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = activeBanners.length;

  const next = React.useCallback(() => setCurrentIndex((i) => (i + 1) % total), [total]);
  const prev = React.useCallback(() => setCurrentIndex((i) => (i - 1 + total) % total), [total]);

  // autoplay
  useEffect(() => {
    if (!autoPlay || total < 2) return;
    const iv = setInterval(next, autoPlayInterval);
    return () => clearInterval(iv);
  }, [autoPlay, autoPlayInterval, total, next]);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: next,
    onSwipedRight: prev,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (!total) return null;

  return (
    <div
      {...swipeHandlers}
      className="relative w-full overflow-hidden rounded-lg shadow-lg"
    >
      {/* aspect ratio box to maintain height based on width */}
      <div className="w-full aspect-video">
        <div
          className="flex h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {activeBanners.map((b, idx) => (
            <div key={idx} className="min-w-full h-full relative">
              <img
                src={`${BASE_URL}${b.image}`}
                alt={b.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
              {b.title && (
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded text-sm md:text-base">
                  {b.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* controls */}
      {showControls && total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute top-1/2 left-2  -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full backdrop-blur"
          >
            <GoArrowLeft className="w-5 h-5 text-black" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute top-1/2 right-2  -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 rounded-full backdrop-blur"
          >
            <GoArrowRight className="w-5 h-5 text-black" />
          </button>
        </>
      )}

      {/* dots */}
      {showDots && total > 1 && (
        <div className="absolute bottom-2 left-1/2  -translate-x-1/2 flex space-x-2">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentIndex ? "bg-white" : "bg-gray-400/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
