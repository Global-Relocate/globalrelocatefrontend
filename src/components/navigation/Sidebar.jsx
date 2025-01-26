import { useState } from "react";
import { BiChevronDown} from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "@/context/favorites-context";
import { GoArrowUpRight } from "react-icons/go";
import CounterBadge from "../common/CounterBadge";
import CountdownTimer from '../common/CountdownTimer';

function Sidebar({ navData, navState }) {
  const width = navState ? "w-64" : "w-0 sm:w-64";
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const [openItemIndex, setOpenItemIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  return (
    <div
      className={`
        fixed top-20 flex flex-col items-center justify-between  bottom-0 transition-width duration-500 overflow-hidden ${width} 
        bg-white text-black h-screen shadow-sm border border-[#D4D4D4] border-t-0 z-50 
      `}
    >
      <div className="w-full pt-6 px-5">
        <ul className=" space-y-3">
          {navData?.map((item, i) => {
            const isActive = location.pathname.includes(item.activeKey);
            const IconComponent =
              isActive && item.activeIcon ? item.activeIcon : item.icon;

            return (
              <div key={i}>
                <li
                  className={`
                  flex items-center font-medium rounded-2xl pl-3 py-2 cursor-pointer 
                    transition-colors duration-200
                    whitespace-nowrap
                  ${
                    isActive ? "bg-[#FEE3B8] text-black" : "bg-white text-black"
                  }
                `}
                  onClick={() =>
                    item.dropDown ? toggleDropdown(i) : navigate(item.path)
                  }
                >
                  <img
                    src={
                      typeof IconComponent === "string" ? IconComponent : null
                    }
                    className="w-5 h-5 mr-2"
                    alt=""
                  />
                  {item.title}
                  {item.title === "Favourites" && (
                    <CounterBadge count={favorites.length} />
                  )}
                  {item.dropDown && (
                    <span className="ml-auto text-lg">
                      <BiChevronDown />
                    </span>
                  )}
                </li>
                {item.dropDown && openItemIndex === i && (
                  <ul className="flex flex-col mt-2 pl-12 space-y-1">
                    {item.dropDown.map((subItem, j) => (
                      <li key={j}>
                        <Link
                          to={subItem.path}
                          className="text-sm font-normal text-gray-300 hover:text-white py-1 block"
                        >
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </ul>
      </div>

      <div className="mb-[100px] whitespace-nowrap w-full flex flex-col items-center">
        <div className="w-[90%] border p-2 bg-[#F5F5F5] mb-3 rounded-xl">
          <h3 className="font-semibold">Try Pro</h3>
          <p className=" my-3 text-sm text-gray-700">
            You're currently in free plan <br />
            valid for 3days. Upgrade now <br /> to keep using Global relocate
          </p>
          <CountdownTimer />
          <Button className="bg-black w-full text-sm text-white py-2 rounded-xl">
            Learn More <GoArrowUpRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
