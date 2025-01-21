import DashboardLayout from "@/components/layouts/DashboardLayout";
import React from "react";
import { GrFavorite } from "react-icons/gr";

function Favourites() {
  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">Favourites</h2>
      </div>
      <div className="flex flex-col items-center justify-center h-[45vh]">
        <GrFavorite size={36} className="mb-4 text-gray-600" />
        <p className="text-gray-600">You haven't liked any favourites yet.</p>
      </div>
    </DashboardLayout>
  );
}

export default Favourites;
