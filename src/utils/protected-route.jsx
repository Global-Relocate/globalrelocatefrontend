import { AuthContext } from "@/context/AuthContext";
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {

  const location = useLocation()

  if (location.pathname.startsWith("/shared-chat")) {
    return <div>{children}</div>;
  }

  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <div>{children}</div>;
}
