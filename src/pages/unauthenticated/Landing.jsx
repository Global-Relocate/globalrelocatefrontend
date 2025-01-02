import React from "react";
import MainLayout from "../../component/layouts/MainLayout";

export default function Landing() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center">
        <div className="bg-black min-h-[100vh] w-full flex items-center justify-center">
          <div className="flex flex-col items-center justify-center max-w-[600px] text-white">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold uppercase">
              Global.Relocate
            </h1>
            <p className="text-center my-8 text-xl md:text-3xl line-clamp-3">
              Your companion for immigration, company formation, and living in
              new companies.
            </p>
            <button className="bg-[#fca311] py-2 px-14 rounded-2xl text-2xl font-semibold">
              Start Now
            </button>
          </div>
        </div>
        <h2 className="text-3xl my-4 font-semibold">Features</h2>
        <div className="flex items-start justify-between flex-wrap  py-10 w-[90%]">
          <div className="flex flex-col items-start w-[300px]">
            <h3 className="font-bold text-lg">Countries Information</h3>
            <p className="mt-2">
              Access detailed insights about any country—travel tips, local
              regulations, cultural highlights, costs of living and tax rates
              —organized in one platform for ease of use.
            </p>
          </div>
          <div className="flex flex-col items-start w-[300px]">
            <h3 className="font-bold text-lg">Community</h3>
            <p className="mt-2">
              Connect with a supportive community, trusted experts, Forums and
              groups, who provide reliable, experience-based advice tailored to
              your needs.
            </p>
          </div>
          <div className="flex flex-col items-start w-[300px]">
            <h3 className="font-bold text-lg">Tools</h3>
            <p className="mt-2">
              Country Comparison, Tax Calculator and AI Assistant
            </p>
            <button className="bg-[#fca311] text-white mt-2 py-1 px-6 rounded-2xl text-md font-semibold">
              Get started
            </button>
          </div>
          <div className="flex flex-col items-start w-[300px]">
            <h3 className="font-bold text-lg">Contacts</h3>
            <p className="mt-2">
              Connect with Lawyers, tax advisors, relocation services and
              more...
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
