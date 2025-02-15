import React from "react";

export default function FeaturesCard({ title, para, image }) {
  return (
    <div className="w-[380px] flex flex-col items-center justify-evenly h-[300px] bg-white rounded-lg shadow-md py-8 px-5">
      <img src={image} alt="" />
      <div className="flex flex-col items-center">
        <h2 className="font-medium text-xl mb-4">{title}</h2>
        <p className="text-[#626262] text-sm text-center px-5">
          {para}
        </p>
      </div>
    </div>
  );
}
