import { useState } from "react";
import { BiChevronDown, BiSignal4 } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

function Sidebar({ navData, navState }) {
  const width = navState ? "w-64" : "w-0 sm:w-64";
  const navigate = useNavigate();
  const [openItemIndex, setOpenItemIndex] = useState(null);

  const toggleDropdown = (index) => {
    setOpenItemIndex(openItemIndex === index ? null : index);
  };

  function isActive(path) {
    return window.location.href.includes(path);
  }

  return (
    <div
      className={`
        fixed top-20 flex flex-col items-center justify-between  bottom-0 transition-width duration-500 overflow-hidden ${width} 
        bg-white text-black h-screen shadow-sm border border-[#D4D4D4] border-t-0 z-50 
      `}
    >
      <div className="w-full pt-6 px-5">
        <ul className=" space-y-3">
          {navData?.map((item, i) => (
            <div key={i}>
              <li
                className={`
                  flex items-center font-medium rounded-2xl pl-3 py-2 cursor-pointer 
                    transition-colors duration-200
                    whitespace-nowrap
                  ${
                    isActive(item.activeKey)
                      ? "bg-[#FEE3B8] text-black"
                      : "bg-white text-black"
                  }
                `}
                onClick={() =>
                  item.dropDown ? toggleDropdown(i) : navigate(item.path)
                }
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

      <div className="mb-[100px] w-full flex flex-col items-center">
        <div className="w-[90%] border p-2 border-[#D4D4D4] mb-3 rounded-xl">
          <p className="whitespace-normal my-4 text-sm text-gray-700">
            You're currently in view only mode. To gain complete access to
            Global relocate
          </p>
          <button className="bg-black w-full text-sm text-white py-2 rounded-xl">
            Login
          </button>
        </div>
        <button className="border w-[90%] text-sm border-black text-black py-2 rounded-xl">
          Upgrade to pro
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
