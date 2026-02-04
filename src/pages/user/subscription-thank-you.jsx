import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layouts/MainLayout";
import DashNav from "@/components/navigation/DashNav";
import { getSubscriptionDetails } from "@/services/api";

const SubscriptionThankYou = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navState, setNavState] = useState(false);

  useEffect(() => {
    // Fetch subscription details to show user their plan
    const fetchSubscriptionData = async () => {
      try {
        const response = await getSubscriptionDetails();
        if (response?.data) {
          setSubscriptionData(response.data);
        }
      } catch (error) {
        console.error("Error fetching subscription details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  const handleExploreFeatures = () => {
    navigate("/user/countries");
  };

  const handleGoToDashboard = () => {
    navigate("/user/ai-assistant");
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  if (loading) {
    return (
      <MainLayout>
        <DashNav navState={navState} setNavState={setNavState} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      </MainLayout>
    );
  }

  const planName = subscriptionData?.plan || "Premium";
  const planPrice = subscriptionData?.monthlyPrice || "0";
  const renewalDate =
    subscriptionData?.nextBillingDate || new Date().toLocaleDateString();

  return (
    <MainLayout>
      <DashNav navState={navState} setNavState={setNavState} />

      <motion.div
        className="min-h-screen bg-gradient-to-br from-[#f8f9ff] to-white pt-32 pb-12 px-4 sm:px-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <motion.div
            className="flex justify-center mb-8"
            variants={itemVariants}
          >
            <div className="relative">
              <motion.div
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <FaCheckCircle className="text-5xl text-green-500" />
              </motion.div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="text-center mb-12"
            variants={containerVariants}
          >
            <motion.h1
              className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              {t("subscriptionThankYou.title") || "Welcome to Premium!"}
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 mb-6"
              variants={itemVariants}
            >
              {t("subscriptionThankYou.subtitle") ||
                "Your subscription has been successfully activated. Thank you for choosing us!"}
            </motion.p>

            {/* Plan Details Card */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 mb-8 border-2 border-gray-100"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t("subscriptionThankYou.planDetails") || "Your Plan Details"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                {/* Plan Type */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    {t("subscriptionThankYou.planType") || "Plan"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{planName}</p>
                </div>

                {/* Price */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    {t("subscriptionThankYou.price") || "Monthly Price"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{planPrice}
                  </p>
                </div>

                {/* Next Billing Date */}
                <div className="text-center p-4 bg-gray-50 rounded-lg sm:col-span-2">
                  <p className="text-sm text-gray-600 mb-2">
                    {t("subscriptionThankYou.nextBilling") ||
                      "Next Billing Date"}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(renewalDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-600 border-t pt-4">
                <p>
                  {t("subscriptionThankYou.autoRenewal") ||
                    "Your subscription will automatically renew on your next billing date. You can manage your subscription anytime in your account settings."}
                </p>
              </div>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
              variants={itemVariants}
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t("subscriptionThankYou.unlockedFeatures") ||
                  "You Now Have Access To:"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                {[
                  t("subscriptionThankYou.features.feature1") ||
                    "Advanced country comparison",
                  t("subscriptionThankYou.features.feature2") ||
                    "AI-powered insights",
                  t("subscriptionThankYou.features.feature3") ||
                    "Tax calculator tools",
                  t("subscriptionThankYou.features.feature4") ||
                    "Premium visa resources",
                  t("subscriptionThankYou.features.feature5") ||
                    "Priority support",
                  t("subscriptionThankYou.features.feature6") ||
                    "Data export features",
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    variants={itemVariants}
                  >
                    <FaCheckCircle className="text-green-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={itemVariants}
            >
              <Button
                onClick={handleGoToDashboard}
                className="bg-black text-white hover:bg-gray-800 px-8 py-4 rounded-full text-lg font-semibold h-auto"
              >
                {t("subscriptionThankYou.startExploring") || "Start Exploring"}
              </Button>

              {/* <Button
                onClick={handleExploreFeatures}
                variant="outline"
                className="border-2 border-black text-black hover:bg-gray-100 px-8 py-6 rounded-lg text-lg font-semibold h-auto"
              >
                {t("subscriptionThankYou.viewFeatures") || "View All Features"}
              </Button> */}
            </motion.div>

            {/* Help Text */}
            <motion.p
              className="text-gray-600 text-sm mt-8"
              variants={itemVariants}
            >
              {t("subscriptionThankYou.needHelp") ||
                "Need help getting started?"}{" "}
              <a
                href="/contact-us"
                className="text-blue-600 hover:underline font-semibold"
              >
                {t("subscriptionThankYou.contactSupport") || "Contact Support"}
              </a>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </MainLayout>
  );
};

export default SubscriptionThankYou;
