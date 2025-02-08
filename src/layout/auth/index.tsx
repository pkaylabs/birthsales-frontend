import React from "react";
import logo from "@/assets/images/logo.png";
import render from "@/assets/images/render.jpg";
import { Link, Navigate, Outlet, useLocation } from "react-location";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function AuthLayout() {
  return (
    <div className="font-poppins w-full flex flex-col justify-between items-center overflow-y-auto">
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
}
