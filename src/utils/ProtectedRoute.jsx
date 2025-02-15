import { AuthContext } from "@/context/AuthContext";
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  console.log(user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <div>{children}</div>;
}
