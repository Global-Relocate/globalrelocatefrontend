import { useState, useEffect } from "react";
import { getSubscriptionDetails } from "@/services/api";
import { useTranslation } from "react-i18next";

// Helper function to check if current route is a public route
const isPublicRoute = () => {
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgotpassword",
    "/resetpassword",
    "/verifymail",
    "/welcome",
    "/help",
    "/privacy",
    "/term",
  ];
  const currentPath = window.location.pathname;

  // Check for exact matches
  if (publicRoutes.includes(currentPath)) {
    return true;
  }

  // Check for partial matches (like /help/some-article)
  return publicRoutes.some(
    (route) => route !== "/" && currentPath.startsWith(route)
  );
};

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [shouldShow, setShouldShow] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    let timer;

    const fetchSubscriptionAndStartTimer = async () => {
      // Skip API call on public routes
      if (isPublicRoute()) {
        // Set default values for public routes
        setTimeLeft({ days: 7, hours: 0, minutes: 0, seconds: 0 });
        setIsLoading(false);
        return;
      }

      try {
        const response = await getSubscriptionDetails();

        if (!response || !response.success) {
          setIsLoading(false);
          setShouldShow(false);
          return;
        }

        const { trial, subscription, overallStatus } = response.data || {};

        // Check if user should not see the timer:
        // 1. User is an ADMIN (subscription?.plan === "ADMIN")
        // 2. Subscription is active (overallStatus === "active")
        // 3. User has INFINITE trial
        const isAdmin = subscription?.plan === "ADMIN";
        const hasActiveSubscription = overallStatus === "active";
        const hasInfiniteTrial =
          trial?.remainingDays === "INFINITE" || trial?.end === "INFINITE";

        if (isAdmin || hasActiveSubscription || hasInfiniteTrial) {
          setShouldShow(false);
          setIsLoading(false);
          return;
        }

        // Initialize target date
        let targetDate;

        // Method 1: Check if trial.end is an ISO date string
        if (
          trial?.end &&
          trial.end !== "INFINITE" &&
          typeof trial.end === "string"
        ) {
          try {
            // Try parsing the ISO date string
            targetDate = new Date(trial.end);

            // Verify we got a valid date (not Invalid Date)
            if (isNaN(targetDate.getTime())) {
              console.error("Invalid date format from trial.end:", trial.end);
              targetDate = null;
            }
          } catch (e) {
            console.error("Error parsing trial end date:", e);
            targetDate = null;
          }
        }

        // Method 2: Use remainingDays if no valid end date was found
        if (
          !targetDate &&
          trial?.remainingDays &&
          trial.remainingDays !== "INFINITE"
        ) {
          // If remainingDays is a number, use it
          if (typeof trial.remainingDays === "number") {
            targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + trial.remainingDays);
          } else {
            // Try to parse remainingDays as a number
            const days = parseInt(trial.remainingDays, 10);
            if (!isNaN(days)) {
              targetDate = new Date();
              targetDate.setDate(targetDate.getDate() + days);
            }
          }
        }

        // If we couldn't determine a target date, don't show the timer
        if (!targetDate) {
          console.error("Could not determine trial end date");
          setShouldShow(false);
          setIsLoading(false);
          return;
        }

        // Start the timer interval
        timer = setInterval(() => {
          const now = new Date();
          const distance = targetDate.getTime() - now.getTime();

          if (distance < 0) {
            clearInterval(timer);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return;
          }

          // Calculate time components
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((distance % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subscription details:", error);
        setIsLoading(false);
        setShouldShow(false);
      }
    };

    fetchSubscriptionAndStartTimer();

    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">{t("userDashboard.trial.loading")}</div>
    );
  }

  // Don't show the timer if the shouldShow flag is false
  if (!shouldShow) {
    return null;
  }

  // Don't show the timer if there's no time left
  if (
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0
  ) {
    return (
      <div className="text-center">
        <p className="text-gray-600">{t("userDashboard.trial.trialEnded")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-flow-col gap-2 text-center auto-cols-max">
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.days).padStart(2, "0")}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">
          {t("userDashboard.trial.days")}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.hours).padStart(2, "0")}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">
          {t("userDashboard.trial.hours")}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.minutes).padStart(2, "0")}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">
          {t("userDashboard.trial.minutes")}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-lg font-medium text-[#5762D5]">
          {String(timeLeft.seconds).padStart(2, "0")}
        </span>
        <span className="text-[10px] text-[#5762D5]/60">
          {t("userDashboard.trial.seconds")}
        </span>
      </div>
    </div>
  );
};

export default CountdownTimer;
