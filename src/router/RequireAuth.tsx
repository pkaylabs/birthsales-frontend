import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-location";
import { useAppSelector } from "@/redux";
import { AccessDenied } from "./AccessDenied";

interface RequireAuthProps {
  children: ReactNode;
  roles?: ("ADMIN" | "VENDOR" | "DELIVERY")[];
}

export const RequireAuth: React.FC<RequireAuthProps> = ({
  children,
  roles,
}) => {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) {
    // redirect to login, carry on where they wanted to go
    return (
      <Navigate to="/login" search={{ redirect: location.current.pathname }} />
    );
  }

  if (roles) {
    const userType =
      typeof user.user_type === "string" ? user.user_type.toUpperCase() : "";
    const isAdmin =
      user.is_superuser || user.is_staff || userType === "ADMIN";
    const isVendor = userType === "VENDOR";
    const isDelivery = userType === "DELIVERY";
    const ok =
      (roles.includes("ADMIN") && isAdmin) ||
      (roles.includes("VENDOR") && isVendor) ||
      (roles.includes("DELIVERY") && isDelivery);
    if (!ok) {
      return <AccessDenied />;
    }
  }

  return children;
};
