import { Link, Navigate } from "react-router-dom";
import { useState, Fragment } from "react";
import Sidebar from "../navigation/Sidebar";
import DashNav from "../navigation/DashNav";

import ProtectedRoute from "@/utils/ProtectedRoute";
import { userSidebarItems } from "../../fakeDataStore";

function DashboardLayout({ children }) {
  const [navState, setNavState] = useState(false);

  //   const navData = {
  //     fullName: authState.user.name,
  //     mail: authState.user.email,
  //     profile: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${authState.user.name}`,
  //   };

  return (
    <ProtectedRoute>
      <Fragment>
        <DashNav
          // title={title}
          setNavState={setNavState}
          // navData={navData}
          navState={navState}
        />
        <div className="flex">
          <Sidebar navData={userSidebarItems} navState={navState} />
          <div className="ml-0 sm:ml-64 w-full min-h-screen flex flex-col">
            <div className="px-3 pt-32 sm:px-8 w-full ">{children}</div>
          </div>
        </div>
      </Fragment>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
