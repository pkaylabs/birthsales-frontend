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
    const isAdmin =
      user.is_superuser || user.is_staff || user.user_type === "ADMIN";
    const isVendor = user.user_type === "VENDOR";
    const isClient = !isAdmin && !isVendor;
    const ok =
      (roles.includes("ADMIN") && isAdmin) ||
      (roles.includes("VENDOR") && isVendor) ||
      (roles.includes("DELIVERY") && isClient);
    if (!ok) {
      return <AccessDenied />;
    }
  }

  return children;
};
