import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isTokenValid = true;
  if (!isTokenValid) {
    return <Navigate to="/login" />;
  }
  return <div>{children}</div>;
}
