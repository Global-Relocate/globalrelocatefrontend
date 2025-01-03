import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../component/layouts/MainLayout";
import { TbInvoice, TbWorldPin, TbWorldShare } from "react-icons/tb";
import { FaBriefcase } from "react-icons/fa";
import { RiBriefcase2Line } from "react-icons/ri";
import { AiOutlineDollar } from "react-icons/ai";
import { FaCentSign } from "react-icons/fa6";
import { ImCoinYen } from "react-icons/im";

export default function Landing() {
  const navigate = useNavigate();

  const handleStartNow = () => {
    navigate("/login");
  };

  const handleSignUp = () => {
    navigate("/signup");
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center">
        <div className="hero-bg min-h-[100vh] w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-[600px] text-white">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase">
              Global.Relocate
            </h1>
            <p className="text-center my-8 text-xl md:text-3xl line-clamp-3">
              Your companion for immigration, company formation, and living in
              new companies.
            </p>
            <button
              className="bg-[#fca311] py-2 px-14 rounded-3xl text-2xl font-semibold"
              onClick={handleStartNow}
            >
              Start Now
            </button>
          </div>
        </div>
        <h2 className="text-3xl my-4 font-semibold">Features</h2>
        <div className="flex items-start justify-between flex-wrap  py-10 w-[90%]">
          <div className="flex items-start gap-2 flex-wrap justify-evenly w-[400px]">
            <div className="flex flex-col items-center justify-center w-[100px]">
              <TbWorldShare className="text-5xl  text-[#fca311]" />
              <span className="text-sm text-center">
                Lorem ipsum dolor sit amet{" "}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center w-[100px]">
              <RiBriefcase2Line className="text-5xl  text-[#fca311]" />
              <span className="text-sm text-center">
                Lorem ipsum dolor sit amet{" "}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center w-[100px]">
              <TbInvoice className="text-5xl  text-[#fca311]" />
              <span className="text-sm text-center">
                Lorem ipsum dolor sit amet{" "}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center w-[100px]">
              <ImCoinYen className="text-5xl  text-[#fca311]" />
              <span className="text-sm text-center">
                Lorem ipsum dolor sit amet{" "}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center w-[100px]">
              <AiOutlineDollar className="text-5xl  text-[#fca311]" />
              <span className="text-sm text-center">
                Lorem ipsum dolor sit amet{" "}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center w-[100px]">
              <FaCentSign className="text-5xl  text-[#fca311]" />
              <span className="text-sm text-center">
                Lorem ipsum dolor sit amet{" "}
              </span>
            </div>
          </div>
          <div className="flex items-start gap-2 justify-start w-[300px]">
            <TbWorldShare className="text-5xl text-[#43687d]" />
            <div className="flex flex-col items-start w-full">
              <h3 className="font-bold text-lg">Countries Information</h3>
              <p className="mt-2">
                Access detailed insights about any country—travel tips, local
                regulations, cultural highlights, costs of living and tax rates
                —organized in one platform for ease of use.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 justify-start w-[300px]">
            <FaBriefcase className="text-5xl text-[#43687d]" />
            <div className="flex flex-col items-start">
              <h3 className="font-bold text-lg">Tools</h3>
              <p className="mt-2">
                Country Comparison, Tax Calculator and AI Assistant
              </p>
              <button className="bg-[#fca311] text-white mt-2 py-1 px-6 rounded-2xl text-md font-semibold">
                Get started
              </button>
            </div>
          </div>
          <div className="flex items-start gap-2 justify-start w-[300px]">
            <TbWorldPin className="text-5xl text-[#43687d]" />
            <div className="flex flex-col items-start w-full">
              <h3 className="font-bold text-lg">Any Countries</h3>
              <p className="mt-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Voluptates vero nihil porro expedita sequi, officiis inventore.
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full p-4 flex-wrap items-center justify-evenly bg-[#d3d3d3]">
          <div className="flex items-start gap-2 justify-start w-[300px]">
            <TbWorldPin className="text-5xl text-[#43687d]" />
            <div className="flex flex-col items-start w-full">
              <h3 className="font-bold text-lg">Visa & Immigration</h3>
              <p className="mt-2">Lorem ipsum dolor sit amet, consectetur</p>
            </div>
          </div>
          <div className="flex items-start gap-2 justify-start w-[300px]">
            <TbWorldPin className="text-5xl text-[#43687d]" />
            <div className="flex flex-col items-start w-full">
              <h3 className="font-bold text-lg">Tax System</h3>
              <p className="mt-2">Lorem ipsum dolor sit amet, consectetur</p>
            </div>
          </div>
          <div className="flex items-start gap-2 justify-start w-[300px]">
            <AiOutlineDollar className="text-5xl text-[#43687d]" />
            <div className="flex flex-col items-start w-full">
              <h3 className="font-bold text-lg">Cost of Living</h3>
              <p className="mt-2">Lorem ipsum dolor sit amet, consectetur</p>
            </div>
          </div>
          <div className="flex items-start gap-2 justify-start w-[300px]">
            <TbWorldPin className="text-5xl text-[#43687d]" />
            <div className="flex flex-col items-start w-full">
              <h3 className="font-bold text-lg">Contacts</h3>
              <p className="mt-2">Lorem ipsum dolor sit amet, consectetur</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
