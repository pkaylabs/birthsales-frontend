import React from "react";
import ServiceCard from "./components/ServiceCard";
import { useGetServicesQuery } from "@/redux/features/services/servicesApi";
import { Service } from "@/redux/type";

const Services = () => {

  const { data: services = [], isLoading: Loading, isError: Error } = useGetServicesQuery();

  if(!services) return <div>No data found</div>

  if(Loading) return <div>Loading..</div>

  if(Error) return <div>Error getting services</div> 


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
