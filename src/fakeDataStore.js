import { CiMemoPad } from "react-icons/ci";
import { FaMoneyBill, FaUser } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { ImOffice } from "react-icons/im";
import { IoPersonAdd } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";

export const userSidebarItems = [
  {
    title: "Countries",
    activeKey: "/user/countries",
    path: "/user/countries",
    icon: MdSpaceDashboard,
  },
  {
    title: "Ai Assistant",
    activeKey: "/user/ai-assistant",
    path: "/user/ai-assistant",
    icon: CiMemoPad,
  },
  {
    title: "Compare Countries",
    activeKey: "/user/compare",
    path: "/user/position",
    icon: IoPersonAdd,
  },
  {
    title: "Tax Calculator",
    activeKey: "/admin/structure",
    path: "/admin/structure",
    icon: ImOffice,
  },
  {
    title: "Notifications",
    activeKey: "/admin/staffs",
    path: "/admin/staffs",
    icon: FaPeopleGroup,
  },
  {
    title: "Favourites",
    activeKey: "/admin/budgets",
    path: "/admin/budgets",
    icon: FaMoneyBill,
  },
  {
    title: "Community",
    activeKey: "/admin/budgets",
    path: "/admin/budgets",
    icon: FaMoneyBill,
  },
];
