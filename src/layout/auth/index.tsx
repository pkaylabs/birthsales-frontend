import React from "react";
import logo from "@/assets/images/logo.png";
import render from "@/assets/images/render.jpg";
import { Link, Navigate, Outlet, useLocation } from "react-location";

export default function AuthLayout() {
  return (
    <main className="w-full h-screen flex justify-between items-center">
      <div className="">auth</div>
      <Outlet />
      
    </main>
  );
}
