import React, { createContext, useContext } from "react";

// Define the Product interface
export interface Product {
  id: number;
  name: string;
  image?: string;
  additionalImages?: string[];
  category: string;
  price: string | number;
  dateAdded: string;
  quantity: string | number;
  stock?: number;
  sales?: number;
  revenue?: number;
}

// This is your static products array.
const products: Product[] = [
  {
    id: 1,
    name: "Laptop",
    image:
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop",
    additionalImages: [
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?q=80&w=2070&auto=format&fit=crop",
    ],
    category: "Electronics",
    price: 1200,
    dateAdded: "2025-01-15",
    quantity: 50,
    stock: 50,
    sales: 120,
    revenue: 60000,
  },
  {
    id: 2,
    name: "Smartphone",
    image:
      "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop",
    additionalImages: [
      "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop",
      "https://plus.unsplash.com/premium_photo-1680623400141-7e129b7c56d0?q=80&w=2070&auto=format&fit=crop",
    ],
    category: "Electronics",
    price: 800,
    dateAdded: "2025-01-10",
    quantity: 30,
    stock: 30,
    sales: 200,
    revenue: 80000,
  },
];

// Create the context with the products array as the default value.
const ProductContext = createContext<Product[]>(products);

// Custom hook for easy access
export const useProducts = () => useContext(ProductContext);

// Provider component to wrap your app
export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ProductContext.Provider value={products}>
      {children}
    </ProductContext.Provider>
  );
};
