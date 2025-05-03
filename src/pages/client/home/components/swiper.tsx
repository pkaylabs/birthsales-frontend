import { Banner } from "@/redux/type";
import React, { useEffect, useState } from "react";
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import { useSwipeable } from "react-swipeable";

interface CarouselProps {
  banners: Banner[]; // Array of custom components or content
  autoPlay?: boolean; // Option to enable auto play
  autoPlayInterval?: number; // Interval for auto play in milliseconds
  showDots?: boolean; // Option to show dots for navigation
  showControls?: boolean; // Option to show next/prev controls
}

const Carousel: React.FC<CarouselProps> = ({
  banners = [],
  autoPlay = false,
  autoPlayInterval = 10000,
  showDots = true,
  showControls = true,
}) => {
  const activeBanners = banners?.filter((b) => b.is_active);
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalBanners = activeBanners.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalBanners);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalBanners) % totalBanners);
  };

  useEffect(() => {
    if (autoPlay && totalBanners > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, totalBanners]);

  const handlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  if (totalBanners === 0) return null;

  return (
    <div
      className="relative w-full h-64 md:h-96 lg:h-[500px] overflow-hidden rounded-lg shadow-lg"
      {...handlers}
    >
      {/* Carousel Content */}
      <div
        className="flex h-full transition-transform duration-700 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {activeBanners.map((banner, idx) => (
          <div
            key={idx}
            className="min-w-full h-full relative"
            aria-label={banner.title}
          >
            <img
              src={banner.link}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            {banner.title && (
              <div className="absolute bottom-6 left-6 bg-black bg-opacity-60 text-white px-4 py-2 rounded">
                <h3 className="text-lg md:text-xl font-semibold">
                  {banner.title}
                </h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      {showControls && totalBanners > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur"
            aria-label="Previous"
          >
            <GoArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white p-2 rounded-full backdrop-blur"
            aria-label="Next"
          >
            <GoArrowRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Navigation Dots */}
      {showDots && totalBanners > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 focus:outline-none $`
              + `${i === currentIndex ? 'bg-white' : 'bg-gray-400/70'}`
              }
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
