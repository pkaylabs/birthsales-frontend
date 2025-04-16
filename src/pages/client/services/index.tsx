import React from "react";
import ServiceCard from "./components/ServiceCard";

export interface Service {
  id: number;
  img: string;
  title: string;
  description: string;
  startPrice: number;
  endPrice: number;
}

const services: Service[] = [
  {
    id: 1,
    img: "https://plus.unsplash.com/premium_photo-1663047523120-055de6d869d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Hair Dressing",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 300,
    endPrice: 500,
  },
  {
    id: 2,
    img: "https://plus.unsplash.com/premium_photo-1664109999537-088e7d964da2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Health and Fitness",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 50,
    endPrice: 100,
  },
  {
    id: 3,
    img: "https://images.unsplash.com/photo-1573167101669-476636b96cea?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "IT Services",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 50,
    endPrice: 100,
  },
  {
    id: 4,
    img: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Car Services",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 300,
    endPrice: 500,
  },
  {
    id: 5,
    img: "https://plus.unsplash.com/premium_photo-1677444398697-d565239637f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Barbering Services",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 100,
    endPrice: 600,
  },
  {
    id: 6,
    img: "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Life Coaching",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 100,
    endPrice: 600,
  },
  {
    id: 7,
    img: "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Food Services",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 100,
    endPrice: 600,
  },
  {
    id: 8,
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3",
    title: "Home Rentals",
    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    startPrice: 100,
    endPrice: 600,
  },
];

const Services = () => {
  return (
    <div className="max-w-[80rem] mx-auto p-4 slide-up">
      <div className="flex flex-col gap-5">
        {/* Breadcrumb */}
        <div className="mt-6 flex flex-row items-center  space-x-2 text-gray-400">
          <p className="text-base md:text-lg">Home</p>
          <span className="text-base md:text-lg">/</span>
          <p className="text-black text-2xl md:text-xl">Services</p>
        </div>
        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
