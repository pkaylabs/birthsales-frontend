import React, { useEffect, useState } from "react";

interface CarouselProps {
  items: React.ReactNode[]; // Array of custom components or content
  autoPlay?: boolean; // Option to enable auto play
  autoPlayInterval?: number; // Interval for auto play in milliseconds
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoPlay = false,
  autoPlayInterval = 3000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [startX, setStartX] = useState<number | null>(null);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    if (autoPlay) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, items.length]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startX) return;

    const endX = e.touches[0].clientX;
    const difference = startX - endX;

    if (difference > 50) {
      nextSlide();
      setStartX(null);
    } else if (difference < -50) {
      prevSlide();
      setStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setStartX(null);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Content */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="min-w-full flex justify-center items-center"
          >
            {item}
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-blue-500" : "bg-gray-400"
            }`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>

      {/* Controls */}
      {/* <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black/50 p-2 rounded-full hover:bg-black"
      >
        ❯
      </button> */}
    </div>
  );
};

export default Carousel;
