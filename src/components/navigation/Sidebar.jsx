import { useState } from "react";
import { BiChevronDown, BiSignal4 } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import CounterBadge from "../common/CounterBadge";
import { useFavorites } from "@/context/favorites-context";

function Sidebar({ navData, navState }) {
  const location = useLocation();
  const { favorites } = useFavorites();

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
            const IconComponent = isActive && item.activeIcon ? item.activeIcon : item.icon;
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 mx-2 rounded-lg ${
                  isActive ? "bg-[#F5F5F5]" : "hover:bg-gray-50"
                }`}
              >
                <item.icon className="text-xl mr-3" />
                {item.title}
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
          ))}
        </ul>
      </div>

      <div className="mb-[100px] whitespace-nowrap w-full flex flex-col items-center">
        <div className="w-[90%] border p-2 bg-[#F5F5F5] mb-3 rounded-xl">
          <h3 className="font-semibold">Try Pro</h3>
          <p className=" my-3 text-sm text-gray-700">
            You're currently in free plan <br />
            valid for 3days. Upgrade now <br /> to keep using Global relocate
          </p>
          <Button className="bg-black w-full text-sm text-white py-2 rounded-xl">
            Learn More
          </Button>
                <div className="flex items-center space-x-2">
                  <img 
                    src={typeof IconComponent === 'string' ? IconComponent : null} 
                    className="w-5 h-5"
                    alt=""
                  />
                  <span className="text-sm">{item.title}</span>
                </div>
                {item.title === "Favourites" && <CounterBadge count={favorites.length} />}
              </Link>
            );
          })}
        </div>
        
        <div className="px-4">
          <div className="bg-gray-100 rounded-lg p-4">
            <h3 className="font-medium text-base mb-2">Try Pro</h3>
            <p className="text-sm text-gray-600 mb-4">
              You are currently in free plan valid for 3 days. Upgrade now to keep using Global Relocate.
            </p>
            <Link
              to="/upgrade"
              className="block w-full py-2 px-4 bg-black text-white rounded-lg text-sm hover:bg-gray-800 text-center flex items-center justify-center"
            >
              Learn More <GoArrowUpRight className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
