
import countriesIcon from "./assets/svg/countries.svg";
import aiAssistantIcon from "./assets/svg/ai.svg";
import aiActiveIcon from "./assets/svg/ai-assistant.svg";
import compareIcon from "./assets/svg/compare.svg";
import calculatorIcon from "./assets/svg/calculator.svg";
import calculatorActiveIcon from "./assets/svg/filledcalculator.svg";
import bellIcon from "./assets/svg/bell.svg";
import bellActiveIcon from "./assets/svg/filledbell.svg";
import favoriteIcon from "./assets/svg/favorite.svg";
import filledfavoriteIcon from "./assets/svg/filledfavorite.svg";
import communityIcon from "./assets/svg/community.svg";
import communityActiveIcon from "./assets/svg/communities.svg";

export const userSidebarItems = [
  {
    title: "Countries",
    activeKey: "/user/countries",
    path: "/user/countries",
    icon: countriesIcon,
  },
  {
    title: "Ai Assistant",
    activeKey: "/user/ai-assistant",
    path: "/user/ai-assistant",
    icon: aiAssistantIcon,
    activeIcon: aiActiveIcon,
  },
  {
    title: "Compare Countries",
    activeKey: "/user/compare",
    path: "/user/compare",
    icon: compareIcon,
  },
  {
    title: "Tax Calculator",
    activeKey: "/user/tax-calculator",
    path: "/user/tax-calculator",
    icon: calculatorIcon,
    activeIcon: calculatorActiveIcon,
  },
  {
    title: "Notifications",
    activeKey: "/user/notifications",
    path: "/user/notifications",
    icon: bellIcon,
    activeIcon: bellActiveIcon,
  },
  {
    title: "Favorites",
    activeKey: "/user/favorites",
    path: "/user/favorites",
    icon: favoriteIcon,
    activeIcon: filledfavoriteIcon,
  },
  {
    title: "Community",
    activeKey: "/user/community",
    path: "/user/community",
    icon: communityIcon,
    activeIcon: communityActiveIcon,
  },
];
