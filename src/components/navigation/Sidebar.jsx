import React from "react";
import { Link, useLocation } from "react-router-dom";
import { GoArrowUpRight } from "react-icons/go";
import CounterBadge from "../common/CounterBadge";
import { useFavorites } from "@/context/favorites-context";
import CountdownTimer from '../common/CountdownTimer';

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
            <p className="text-sm text-gray-600 mb-2">
              You are currently in free plan valid for 3 days. Upgrade now to keep using Global Relocate.
            </p>
            <CountdownTimer />
            <Link
              to="/upgrade"
              className="block w-full py-2 px-4 bg-black text-white rounded-lg text-sm hover:bg-gray-800 text-center flex items-center justify-center mt-4"
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
