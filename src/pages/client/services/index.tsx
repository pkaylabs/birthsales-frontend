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
        <div className=" flex justify-between flex-wrap">
          <ServiceCard
            id={1}
            img={
              "https://images.unsplash.com/photo-1691534986134-cac9b2db495f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Speakers"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={300}
            endPrice={500}
          />

          <ServiceCard
            id={2}
            img={
              "https://images.unsplash.com/photo-1733811073382-95d5b79c4cf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Bags"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={50}
            endPrice={100}
          />

          <ServiceCard
            id={3}
            img={
              "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Bags"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={50}
            endPrice={100}
          />
          <ServiceCard
            id={4}
            img={
              "https://images.unsplash.com/photo-1691534986134-cac9b2db495f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Speakers"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={300}
            endPrice={500}
          />
          <ServiceCard
            id={5}
            img={
              "https://images.unsplash.com/photo-1691534986134-cac9b2db495f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Speakers"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={6}
            img={
              "https://images.unsplash.com/photo-1691534986134-cac9b2db495f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Shirts"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={7}
            img={
              "https://images.unsplash.com/photo-1691534986134-cac9b2db495f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Keyboards"
            description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
            startPrice={100}
            endPrice={600}
          />
          <ServiceCard
            id={8}
            img={
              "https://images.unsplash.com/photo-1691534986134-cac9b2db495f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            title="Speakers"
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
