// src/pages/Services.tsx
import React, { useMemo, useState } from "react";
import ServiceCard from "./components/ServiceCard";
import { useGetCustomerServicesQuery } from "@/redux/features/services/servicesApi";
import { Service } from "@/redux/type";
import { Box, TextField } from "@mui/material";

const Services: React.FC = () => {
  const [search, setSearch] = useState("");
  const {
    data: services = [],
    isLoading,
    isError,
  } = useGetCustomerServicesQuery();

  const filteredSearch = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return services;
    return services.filter((s) => s.name.toLowerCase().includes(term));
  }, [services, search]);

  // number of skeleton cards to show
  const SKELETON_COUNT = 8;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-gray-500 text-sm mb-6" aria-label="Breadcrumb">
        <ol className="list-reset flex">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li className="text-gray-900 font-semibold">Services</li>
        </ol>
      </nav>

      <Box className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl sm:text-2xl font-bold text-gray-800">
          Our Services
        </h1>
        <TextField
          size="small"
          placeholder="Search services"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:64"
        />
      </Box>

      {isError && (
        <p className="text-center py-12 text-red-500">
          Error loading services.
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: SKELETON_COUNT }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse flex flex-col bg-white rounded-lg overflow-hidden shadow-md"
            >
              {/* image skeleton */}
              <div className="bg-gray-200 h-48 sm:h-56 md:h-64" />

              {/* content skeleton */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
                <div className="mt-4 h-6 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredSearch.length === 0 ? (
        <p className="text-center py-12 text-gray-500">
          No services found matching "{search}".
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSearch.map((service: Service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
