import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import SelectLanguages from "../drawers/SelectLanguages";
import { FaUser } from "react-icons/fa";
import logo from "../../assets/svg/logo.svg";

function DashNav({ navState, setNavState }) {
  return (
    <div className="flex justify-between items-center h-20 px-5 bg-white text-black border border-[#D4D4D4] w-full shadow-sm fixed z-50 top-0">
      <div className="flex items-center">
        <div className="mr-2 block sm:hidden">
          {!navState ? (
            <GiHamburgerMenu
              className="cursor-pointer"
              onClick={() => setNavState(true)}
            />
          ) : (
            <IoMdClose
              className="cursor-pointer"
              onClick={() => setNavState(false)}
            />
          )}
        </div>
        <div className="flex items-center">
          <img src={logo} alt="logo" className="w-36" />
        </div>
      </div>

      <div className="flex items-center justify-start space-x-2 p-2 rounded-3xl border">
        <div className="flex text-white items-center justify-center h-8 w-8 rounded-full bg-gray-500">
          <FaUser />
        </div>
        <span>Jerry Lamp</span>
      </div>

      <SelectLanguages />
    </div>
  );
}

export default DashNav;
