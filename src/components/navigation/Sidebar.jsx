import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import CounterBadge from "../common/CounterBadge";
import { useFavorites } from "@/context/favorites-context";
import CountdownTimer from "../common/CountdownTimer";
import { useTranslation } from "react-i18next";
import { useNotifications } from '@/context/NotificationsContext';

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
import communityIcon from "../../assets/svg/community.svg";
import communityActiveIcon from "../../assets/svg/communities.svg";

function Sidebar({ navState }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { favorites } = useFavorites();
  const { unreadCount } = useNotifications();

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
      } sm:translate-x-0 w-64 bg-white fixed h-screen transition-transform duration-300 ease-in-out border-r border-[#D4D4D4] pt-20 z-40`}
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
      </div>
    </div>
  );
}

export default Sidebar;
