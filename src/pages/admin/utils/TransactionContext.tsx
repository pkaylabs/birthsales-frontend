import React, { createContext, useContext } from "react";

export interface Transaction {
  id: number;
  userId: number; // Links this transaction to a user
  date: string;
  amount: number;
  status: string;
  product: string;
  image: string;
  method: string;
}

// Dummy transaction data
const transactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    date: "2025-08-02",
    amount: 100,
    status: "Pending",
    product: "Hisense TV",
    method: "Cash on Delivery",
    image:
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    userId: 2,
    date: "2025-08-03",
    amount: 50,
    status: "Pending",
    product: "Blender",
    method: "Cash on Delivery",
    image:
      "https://images.unsplash.com/photo-1585237672814-8f85a8118bf6?q=80&w=1910&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    userId: 1,
    date: "2025-08-04",
    amount: 75,
    status: "Completed",
    product: "Shoe",
    method: "Moible Money",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const TransactionContext = createContext<Transaction[]>(transactions);

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <TransactionContext.Provider value={transactions}>
      {children}
    </TransactionContext.Provider>
  );
};
