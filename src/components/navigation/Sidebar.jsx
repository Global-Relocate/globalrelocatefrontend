import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import CounterBadge from "../common/CounterBadge";
// import { useFavorites } from "@/context/favorites-context";
import CountdownTimer from "../common/CountdownTimer";
import { useTranslation } from "react-i18next";
import { useNotifications } from '@/context/NotificationsContext';
import { getSubscriptionDetails } from '@/services/api';

import countriesIcon from "../../assets/svg/countries.svg";
import aiAssistantIcon from "../../assets/svg/ai.svg";
import aiActiveIcon from "../../assets/svg/ai-assistant.svg";
import compareIcon from "../../assets/svg/compare.svg";
import calculatorIcon from "../../assets/svg/calculator.svg";
import calculatorActiveIcon from "../../assets/svg/filledcalculator.svg";
import bellIcon from "../../assets/svg/bell.svg";
import bellActiveIcon from "../../assets/svg/filledbell.svg";
import favoriteIcon from "../../assets/svg/favorite.svg";
import filledfavoriteIcon from "../../assets/svg/filledfavorite.svg";
// import communityIcon from "../../assets/svg/community.svg";
// import communityActiveIcon from "../../assets/svg/communities.svg";

// eslint-disable-next-line react/prop-types
function Sidebar({ navState }) {
  const { t } = useTranslation();
  const location = useLocation();
  // const { favorites } = useFavorites();
  const { unreadCount } = useNotifications();
  const [showTrialSection, setShowTrialSection] = useState(false);
  
  useEffect(() => {
    const checkSubscriptionStatus = async () => {
      try {
        const response = await getSubscriptionDetails();
        
        if (response && response.success) {
          const { subscription, overallStatus, trial } = response.data || {};
          
          // Hide "Try Pro" section if:
          // 1. User is an ADMIN (subscription.plan === "ADMIN")
          // 2. User has an active subscription (overallStatus === "active")
          // 3. User has INFINITE trial (trial.remainingDays === "INFINITE")
          
          const isAdmin = subscription?.plan === "ADMIN";
          const hasActiveSubscription = overallStatus === "active";
          const hasInfiniteTrial = 
            trial?.remainingDays === "INFINITE" || 
            trial?.end === "INFINITE";
          
          // Check if trial is active
          let isTrialActive = trial?.active;
          
          // Check if trial has valid end date that's in the future
          let trialHasValidPeriod = false;
          
          if (trial?.end && trial.end !== "INFINITE" && typeof trial.end === 'string') {
            // Try parsing the ISO date string
            const endDate = new Date(trial.end);
            const now = new Date();
            
            // Trial is only valid if end date is in the future
            if (!isNaN(endDate.getTime()) && endDate > now) {
              trialHasValidPeriod = true;
            }
          } else if (typeof trial?.remainingDays === 'number' && trial.remainingDays > 0) {
            trialHasValidPeriod = true;
          } else if (trial?.remainingDays && trial.remainingDays !== "INFINITE") {
            // Try to parse remainingDays as a number
            const days = parseInt(trial.remainingDays, 10);
            if (!isNaN(days) && days > 0) {
              trialHasValidPeriod = true;
            }
          }
          
          // Only show trial section if:
          // - User is not admin
          // - User doesn't have active subscription
          // - User doesn't have infinite trial
          // - Trial is active
          // - Trial has a valid period
          setShowTrialSection(
            !isAdmin && 
            !hasActiveSubscription && 
            !hasInfiniteTrial && 
            isTrialActive && 
            trialHasValidPeriod
          );
        } else {
          // If response failed, don't show trial section
          setShowTrialSection(false);
        }
      } catch (error) {
        console.error('Error fetching subscription details:', error);
        setShowTrialSection(false);
      }
    };
    
    checkSubscriptionStatus();
  }, []);

  const navData = [
    {
      title: t("userDashboard.sidebar.countries"),
      activeKey: "/user/countries",
      path: "/user/countries",
      icon: countriesIcon,
    },
    {
      title: t("userDashboard.sidebar.aiAssistant"),
      activeKey: "/user/ai-assistant",
      path: "/user/ai-assistant",
      icon: aiAssistantIcon,
      activeIcon: aiActiveIcon,
    },
    {
      title: t("userDashboard.sidebar.compareCountries"),
      activeKey: "/user/compare",
      path: "/user/compare",
      icon: compareIcon,
    },
    {
      title: t("userDashboard.sidebar.taxCalculator"),
      activeKey: "/user/tax-calculator",
      path: "/user/tax-calculator",
      icon: calculatorIcon,
      activeIcon: calculatorActiveIcon,
    },
    {
      title: t("userDashboard.sidebar.notifications"),
      activeKey: "/user/notifications",
      path: "/user/notifications",
      icon: bellIcon,
      activeIcon: bellActiveIcon,
      count: unreadCount
    },
    {
      title: t("userDashboard.sidebar.favourites"),
      activeKey: "/user/favorites",
      path: "/user/favorites",
      icon: favoriteIcon,
      activeIcon: filledfavoriteIcon,
    },
    // {
    //   title: t("userDashboard.sidebar.community"),
    //   activeKey: "/user/community",
    //   path: "/user/community",
    //   icon: communityIcon,
    //   activeIcon: communityActiveIcon,
    // },
  ];
  return (
    <div
      className={`${
        navState ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0 fixed h-screen transition-transform duration-300 ease-in-out border-r border-[#D4D4D4] pt-20 z-40 bg-white w-64 left-0`}
    >
      <div className="h-full flex flex-col justify-between pb-4">
        <div className="flex-1 overflow-y-auto mt-6">
          {navData.map((item, index) => {
            const isActive = location.pathname.includes(item.activeKey);
            const IconComponent =
              isActive && item.activeIcon ? item.activeIcon : item.icon;

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg ${
                  isActive ? "bg-[#EDEBE8]" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src={
                      typeof IconComponent === "string" ? IconComponent : null
                    }
                    className="w-5 h-5"
                    alt=""
                  />
                  <span className="text-sm">{item.title}</span>
                </div>
                {item.count > 0 && <CounterBadge count={item.count} />}
              </Link>
            );
          })}
        </div>

        {showTrialSection && (
          <div className="px-4">
            <div className="bg-gray-100 rounded-lg p-4">
              <h3 className="font-medium text-base mb-2">
                {" "}
                {t("userDashboard.sidebar.cta.title")}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t("userDashboard.sidebar.cta.para")}
              </p>
              <div className="mb-4">
                <CountdownTimer />
              </div>
              <Link
                to="/upgrade"
                className="w-full py-2 px-4 bg-black text-white rounded-lg text-sm hover:bg-gray-800 text-center flex items-center justify-center"
              >
                {t("userDashboard.sidebar.cta.buttonText")}{" "}
                <GoArrowUpRight className="ml-2" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
