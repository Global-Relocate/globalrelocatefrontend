import { LucideUsersRound } from "lucide-react";
import { CiMemoPad } from "react-icons/ci";
import {
  FaCalculator,
  FaFlag,
  FaMoneyBill,
  FaRegHeart,
  FaUser,
} from "react-icons/fa";
import { FaCodeCompare, FaPeopleGroup } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoPersonAdd } from "react-icons/io5";
import { MdOutlineAssistant, MdSpaceDashboard } from "react-icons/md";

export const userSidebarItems = [
  {
    title: "Countries",
    activeKey: "/user/countries",
    path: "/user/countries",
    icon: FaFlag,
  },
  {
    title: "Ai Assistant",
    activeKey: "/user/ai-assistant",
    path: "/user/ai-assistant",
    icon: MdOutlineAssistant,
  },
  {
    title: "Compare Countries",
    activeKey: "/user/compare",
    path: "/user/compare",
    icon: FaCodeCompare,
  },
  {
    title: "Tax Calculator",
    activeKey: "/user/tax-calculator",
    path: "/user/tax-calculator",
    icon: FaCalculator,
  },
  {
    title: "Notifications",
    activeKey: "/user/notifications",
    path: "/user/notifications",
    icon: IoMdNotificationsOutline,
  },
  {
    title: "Favourites",
    activeKey: "/user/favourites",
    path: "/user/favourites",
    icon: FaRegHeart,
  },
  {
    title: "Community",
    activeKey: "/user/community",
    path: "/user/community",
    icon: LucideUsersRound,
  },
];
