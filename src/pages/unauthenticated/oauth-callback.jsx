import { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContextExport";
import { handleOAuthCallback } from "../../services/api";

export default function OAuthCallback() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("token");
      const type = searchParams.get("type");

      if (!code || !type) {
        console.error("Missing auth parameters");
        navigate("/login", {
          state: { error: "Invalid auth response" },
        });
        return;
      }

      try {
        const response = await handleOAuthCallback(code, type);

        if (response?.token && response?.user) {
          // Login the user
          login(response.token, response.user);

          // Navigate to user countries page
          navigate("/user/countries", {
            state: {
              username:
                response.user.name || response.user.fullName || "Friend",
            },
          });
        } else {
          throw new Error("Invalid authentication response");
        }
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/login", {
          state: {
            error: error.message || "Authentication failed. Please try again.",
          },
        });
      }
    };

    handleAuth();
  }, [login, navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center p-8 max-w-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCA311] mx-auto mb-4"></div>
        <h2 className="text-2xl font-medium mb-4">Processing your login...</h2>
        <p className="text-gray-600">
          Please wait while we complete your authentication.
        </p>
      </div>
    </div>
  );
}
