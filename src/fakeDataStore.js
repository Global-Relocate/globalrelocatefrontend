import countriesIcon from "./assets/svg/countries.svg";
import aiAssistantIcon from "./assets/svg/ai.svg";
import aiActiveIcon from "./assets/svg/ai-assistant.svg";
import compareIcon from "./assets/svg/compare.svg";
import calculatorIcon from "./assets/svg/calculator.svg";
import bellIcon from "./assets/svg/bell.svg";
import favoriteIcon from "./assets/svg/favorite.svg";
import filledfavoriteIcon from "./assets/svg/filledfavourite.svg";
import communityIcon from "./assets/svg/community.svg";

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
  },
  {
    title: "Notifications",
    activeKey: "/user/notifications",
    path: "/user/notifications",
    icon: bellIcon,
  },
  {
    title: "Favourites",
    activeKey: "/user/favourites",
    path: "/user/favourites",
    icon: favoriteIcon,
    activeIcon: filledfavoriteIcon,
  },
  {
    title: "Community",
    activeKey: "/user/community",
    path: "/user/community",
    icon: communityIcon,
  },
];
