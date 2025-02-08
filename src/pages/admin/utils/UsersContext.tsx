import React, { createContext, useContext } from "react";

// Define the user interface
export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  password?: number | string;
  image?: string;
  dateAdded: string;
}

// This is your static users array.
const users: User[] = [
  {
    id: 1,
    username: "jamal123",
    name: "Abdul Nasir Jamal",
    email: "jamalnasir@gmail.com",
    phone: "00000000044",
    address: "Knust, Kumasi",
    image:
      "https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "2025-08-01",
  },
  {
    id: 2,
    username: "prince123",
    name: "Prince kyeremateng",
    email: "prince@gmail.com",
    phone: "05433333445",
    address: "Legon, Accra",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    dateAdded: "2025-02-04",
  },
];

// Create the context with the products array as the default value.
const UserContext = createContext<User[]>(users);

// Custom hook for easy access
export const useUsers = () => useContext(UserContext);

// Provider component to wrap your app
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <UserContext.Provider value={users}>{children}</UserContext.Provider>;
};
