import React from "react";
import { BsInstagram, BsTwitterX } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

export default function Footer() {
  return (
    <div className="text-[#7E7E7E] w-full flex items-center flex-col">
      <div className="w-[90%] flex items-start justify-between p-4">
        <ul className="flex flex-col gap-2">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Countries and Data</a>
          </li>
          <li>
            <a href="#">Community</a>
          </li>
          <li>
            <a href="#">Tools</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <ul className="flex flex-col gap-2">
          <li>
            <a href="#">Blog</a>
          </li>
          <li>
            <a href="#">Imprint & Privacy</a>
          </li>
          <li>
            <a href="#">Terms & Conditions</a>
          </li>
          <li>
            <a href="#">FAQ</a>
          </li>
        </ul>
        <div className="flex flex-col items-start">
          <span>Subscribe for Newsletter</span>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              className="bg-[#ffeccc] py-2 px-4"
              placeholder="Email"
            />
            <button className="bg-[#fba411] text-white py-2 px-6 rounded-r-[15px]">
              Subscribe{" "}
            </button>
          </div>
          <span className="mt-2">Socials</span>
          <div className="flex items-center gap-3 mt-2 ">
            <BsTwitterX className="text-[25px] text-black" />
            <BsInstagram className="text-[25px] text-black" />
            <FaFacebook className="text-[25px] text-black" />
          </div>
        </div>
      </div>
      <span className="text-center py-3">Ⓒ 2023 GlobalRelocate</span>
    </div>
  );
}
