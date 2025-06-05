import { AuthContext } from "@/context/AuthContextExport";
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  const { user } = useContext(AuthContext);

  if (location.pathname.startsWith("/shared-chat")) {
    return <div>{children}</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }
  return <div>{children}</div>;
}
