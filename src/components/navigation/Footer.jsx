import React from "react";
import logo from "../../assets/images/footer_logo.png";

export default function Footer() {
  return (
    <div className="text-[#7E7E7E] w-full flex items-center justify-center flex-col bg-black min-h-[500px]">
      <div className="w-[90%] flex-wrap flex items-start justify-start gap-14 md:gap-36 p-4">
        <img src={logo} alt="logo" />
        <ul className="flex flex-col gap-5">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">Countries & Data</a>
          </li>
          <li>
            <a href="#">Communities</a>
          </li>
          <li>
            <a href="#">Tools</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>

        <ul className="flex flex-col gap-5">
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Privacy</a>
          </li>
        </ul>
      </div>
    </div>
  );
}
