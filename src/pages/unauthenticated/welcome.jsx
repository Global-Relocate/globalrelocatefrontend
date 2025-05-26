import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

export default function Welcome() {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.username || "Friend";
  const { t } = useTranslation();

  const handleContinue = () => {
    navigate("/user/countries");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-3xl font-medium mb-4">
          {t("welcomePage.welcomeAboard")} {userName}
        </h1>
        <p className="text-base text-gray-700 mb-20">
          {t("welcomePage.welcomeText")}
        </p>
        <button
          onClick={handleContinue}
          className="w-full max-w-md mx-auto py-3 rounded-lg bg-[#FCA311] hover:bg-[#e5940c] text-black text-center transition-colors"
        >
          {t("loginPage.continue")}
        </button>
      </div>
    </div>
  );
}
