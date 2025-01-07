import React from "react";
import people from "../../assets/images/people_image.png";
export default function FeaturesCard() {
  return (
    <div className="w-[260px] flex flex-col items-start justify-between h-[320px] bg-white rounded-lg shadow-md py-8 px-5">
      <img src={people} alt="" />
      <div>
        <h2 className="font-medium text-lg mb-4">Community</h2>
        <p className="text-[#626262] text-sm">
          Join forums and groups with like-minded global nomads.{" "}
        </p>
      </div>
    </div>
  );
}
