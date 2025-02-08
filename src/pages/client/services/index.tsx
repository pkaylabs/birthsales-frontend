import React from "react";
import ServiceCard from "./components/ServiceCard";

const Services = () => {
  return (
    <div className="max-w-[80rem] m-auto slide-up">
      <div className="flex flex-col gap-5">
        <div className="mt-6 flex items-center space-x-3 text-gray-400">
          <p className="">Home</p> <span>/</span>{" "}
          <p className="text-black text-2xl">Services</p>
        </div>
        <div className="grid grid-cols-4 gap-2">
          <ServiceCard
            id={1}
            img={
              "https://plus.unsplash.com/premium_photo-1663047523120-055de6d869d6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Hair Dressing"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={300}
            endPrice={500}
          />

          <ServiceCard
            id={2}
            img={
              "https://plus.unsplash.com/premium_photo-1664109999537-088e7d964da2?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Health and Fitness"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={50}
            endPrice={100}
          />

          <ServiceCard
            id={3}
            img={
              "https://images.unsplash.com/photo-1573167101669-476636b96cea?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="IT Services"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={50}
            endPrice={100}
          />
          <ServiceCard
            id={4}
            img={
              "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Car Services"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={300}
            endPrice={500}
          />
          <ServiceCard
            id={5}
            img={
              "https://plus.unsplash.com/premium_photo-1677444398697-d565239637f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Barbering Services"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={6}
            img={
              "https://images.unsplash.com/photo-1578574577315-3fbeb0cecdc2?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Life Coaching"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={7}
            img={
              "https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Food Services"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={8}
            img={
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Home Rentals"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
        </div>
      </div>
    </div>
  );
};

export default Services;
