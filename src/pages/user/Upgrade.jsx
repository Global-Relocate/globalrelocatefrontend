import { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaCheckCircle } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import PropTypes from "prop-types";
import { getSubscriptionDetails, createCheckoutSession } from "@/services/api";
import { showToast } from "@/components/ui/toast";
import logo from "../../assets/svg/logo.svg";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layouts/MainLayout";
import { useTranslation } from "react-i18next";
import DashNav from "@/components/navigation/DashNav";
import { AuthContext } from "@/context/AuthContextExport";
import axios from "axios";
import countryList from "react-select-country-list";
import countryToCurrency from "country-to-currency";

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center">
    <img src={logo} alt="Global Relocate" className="h-12 mb-4" />
    <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#FCA311] border-t-transparent"></div>
  </div>
);

const Upgrade = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [exchangeRate, setExchangeRate] = useState(null);

  const userCountry = user?.country || "DE";
  const country = countryList().getValue(userCountry);
  const userCountryCurrency = countryToCurrency[country] || "EUR";

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  // Fetch exchange rate based on user's country currency
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        if (userCountryCurrency === "EUR") {
          setExchangeRate(1);
          return;
        }

        const response = await axios.get(
          "https://latest.currency-api.pages.dev/v1/currencies/eur.json"
        );
        setExchangeRate(
          response.data.eur[userCountryCurrency.toLowerCase()] || 1
        );
      } catch (err) {
        console.error("Error fetching exchange rate:", err);
        setExchangeRate(1); // Fallback to 1 if error occurs
      }
    };
    fetchExchangeRate();
  }, [userCountryCurrency]);

  useEffect(() => {
    const fetchSubscriptionDetails = async () => {
      try {
        const response = await getSubscriptionDetails();
        setCurrentPlan(response.data?.plan || "FREE");
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubscriptionDetails();
  }, []);

  const handleUpgrade = async (type) => {
    try {
      const planType = type;

      const response = await createCheckoutSession(planType);
      showToast({
        message: t("toast.redirectToPayPage"),
        type: "success",
      });

      if (response.data?.checkout_link) {
        window.location.href = response.data.checkout_link;
      } else {
        throw new Error("Invalid checkout response");
      }
    } catch (err) {
      console.error("Error creating checkout session:", err);
      showToast({
        message: err.message || t("toast.failedToCreateCheckout"),
        type: "error",
      });
    }
  };

  const plans = [
    {
      title: "Free",
      price: "0",
      features: [
        t("userDashboard.upgradePage.freePlan.item1"),
        t("userDashboard.upgradePage.freePlan.item2"),
        t("userDashboard.upgradePage.freePlan.item3"),
        t("userDashboard.upgradePage.freePlan.item4"),
      ],
    },
    {
      title: "Basic",
      price: "15.90",
      rate: exchangeRate,
      features: [
        t("userDashboard.upgradePage.basicPlan.item1"),
        t("userDashboard.upgradePage.basicPlan.item2"),
        t("userDashboard.upgradePage.basicPlan.item3"),
        t("userDashboard.upgradePage.basicPlan.item4"),
        t("userDashboard.upgradePage.basicPlan.item5"),
      ],
    },
    {
      title: "Pro",
      price: "24.90",
      rate: exchangeRate,
      features: [
        t("userDashboard.upgradePage.premiumPlan.item1"),
        t("userDashboard.upgradePage.premiumPlan.item2"),
        t("userDashboard.upgradePage.premiumPlan.item3"),
        t("userDashboard.upgradePage.premiumPlan.item4"),
        t("userDashboard.upgradePage.premiumPlan.item5"),
        t("userDashboard.upgradePage.premiumPlan.item6"),
        t("userDashboard.upgradePage.premiumPlan.item7"),
        t("userDashboard.upgradePage.premiumPlan.item8"),
      ],
    },
  ];

  const businessPlans = [
    {
      title: "Basic",
      price: "79.90",
      rate: exchangeRate,
      features: [
        t("userDashboard.upgradePage.basicPlan.item1"),
        t("userDashboard.upgradePage.basicPlan.item2"),
        t("userDashboard.upgradePage.basicPlan.item3"),
        t("userDashboard.upgradePage.basicPlan.item4"),
        t("userDashboard.upgradePage.basicPlan.item5"),
      ],
    },
    {
      title: "Pro",
      price: "99.90",
      rate: exchangeRate,
      features: [
        t("userDashboard.upgradePage.premiumPlan.item1"),
        t("userDashboard.upgradePage.premiumPlan.item2"),
        t("userDashboard.upgradePage.premiumPlan.item3"),
        t("userDashboard.upgradePage.premiumPlan.item4"),
        t("userDashboard.upgradePage.premiumPlan.item5"),
        t("userDashboard.upgradePage.premiumPlan.item6"),
        t("userDashboard.upgradePage.premiumPlan.item7"),
        t("userDashboard.upgradePage.premiumPlan.item8"),
      ],
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-red-600">
        Error: {error}
      </div>
    );
  }

  const PricingCard = ({
    title,
    price,
    rate,
    isCurrentPlan,
    features,
    buttonText,
    onUpgrade,
  }) => (
    <div
      className={`p-8 rounded-lg border flex flex-col h-full justify-between ${
        isCurrentPlan ? "bg-[#F6F6F6]" : "bg-white"
      }`}
    >
      <div>
        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-2">
            {t(`userDashboard.upgradePage.${title.toLowerCase()}`)}
          </h3>
          <div className="flex items-center gap-1">
            <span className="text-2xl font-semibold">€{price}</span>
            <span className="text-gray-600">
              / {t("userDashboard.upgradePage.perMonth")}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {rate && userCountryCurrency !== "EUR" && (
              <em>
                {t("userDashboard.upgradePage.approx")}:{" "}
                <span className="font-semibold">
                  {userCountryCurrency}{" "}
                  {(parseFloat(price) * rate).toLocaleString()}
                </span>
              </em>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            {t("userDashboard.upgradePage.forEveryone")}
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <FaCheckCircle className="text-[#7981DD] flex-shrink-0" />
              <span className="text-gray-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <Button
          variant={isCurrentPlan ? "outline" : "default"}
          className={`w-full ${
            isCurrentPlan
              ? "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              : "bg-[#FCA311] hover:bg-[#FCA311]/90 text-white"
          }`}
          onClick={() => !isCurrentPlan && onUpgrade()}
          disabled={isCurrentPlan}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );

  PricingCard.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    rate: PropTypes.string.isRequired,
    isCurrentPlan: PropTypes.bool.isRequired,
    features: PropTypes.arrayOf(PropTypes.string).isRequired,
    buttonText: PropTypes.string.isRequired,
    onUpgrade: PropTypes.func.isRequired,
  };

  return (
    <MainLayout>
      <DashNav />
      <div className="min-h-screen bg-white pt-20">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
          >
            <IoArrowBack size={20} />
            <span>{t("userDashboard.upgradePage.back")}</span>
          </button>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-semibold mb-4">
              {t("userDashboard.upgradePage.upgradePlan")}
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {t("userDashboard.upgradePage.upgradePlanDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <PricingCard
                key={plan.title}
                {...plan}
                isCurrentPlan={currentPlan === plan.title.toUpperCase()}
                buttonText={
                  currentPlan === plan.title.toUpperCase()
                    ? t("userDashboard.upgradePage.currentPlan")
                    : t("userDashboard.upgradePage.getStarted")
                }
                onUpgrade={() =>
                  handleUpgrade(
                    plan.title.toLowerCase() === "pro"
                      ? "PREMIUM"
                      : plan.title.toUpperCase()
                  )
                }
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Upgrade;
