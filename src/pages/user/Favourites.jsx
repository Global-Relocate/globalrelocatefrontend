import DashboardLayout from "@/components/layouts/DashboardLayout";
import React from "react";

function Favourites() {
  return (
    <DashboardLayout>
      <div className="w-full flex-wrap gap-y-5 items-center justify-between flex">
        <h2 className="text-3xl font-medium">Favourites</h2>
      </div>
    </DashboardLayout>
  );
}

export default Favourites;
