import React, { createContext, useContext } from "react";

interface Service {
  id?: number;
  name: string;
  description: string;
  price: number | string;
  image?: string;
  bookings?: number;
  provider: string;
  category: string;
}

//initial services
const initialServices: Service[] = [
  {
    id: 1,
    name: "Haircut",
    description: "Professional haircut service",
    price: 25,
    image:
      "https://plus.unsplash.com/premium_photo-1661645788141-8196a45fb483?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    bookings: 15,
    provider: "Jamal",
    category: "Beauty",
  },
  {
    id: 2,
    name: "Massage Therapy",
    description: "Relaxing massage therapy session",
    price: 60,
    image:
      "https://images.unsplash.com/photo-1519824145371-296894a0daa9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

    bookings: 10,
    provider: "Prince",
    category: "Wellness",
  },
];

// Create context
const ServiceContext = createContext<Service[]>(initialServices);

// Custom hook for easy access
export const useServices = () => useContext(ServiceContext);

// Provider component
export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ServiceContext.Provider value={initialServices}>
      {children}
    </ServiceContext.Provider>
  );
};
