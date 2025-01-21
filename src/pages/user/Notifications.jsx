import DashboardLayout from "@/components/layouts/DashboardLayout";
import React from "react";
import bellicon from "../../assets/svg/bell.svg";

function Notifications() {
  return (
    <DashboardLayout>
      <div className="w-full flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-3xl font-medium mb-4">Notifications</h2>
        <img
          src={bellicon}
          alt="Bell Icon"
          className="mb-4"
          style={{ width: '36px', height: '36px', filter: 'invert(41%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(91%) contrast(88%)' }}
        />
        <p className="text-gray-600">You haven’t any notifications yet.</p>
      </div>
    </DashboardLayout>
  );
}

export default Notifications;
