import { AuthContext } from "@/context/AuthContext";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
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
