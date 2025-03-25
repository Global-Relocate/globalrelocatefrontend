import { useState, Fragment } from "react";
import Sidebar from "../navigation/Sidebar";
import DashNav from "../navigation/DashNav";
import ProtectedRoute from "@/utils/protected-route";

function DashboardLayout({ children }) {
  const [navState, setNavState] = useState(false);

  return (
    <ProtectedRoute>
      <Fragment>
        <DashNav setNavState={setNavState} navState={navState} />
        <div className="flex">
          <Sidebar navState={navState} />
          <div className="ml-0 sm:ml-64 w-full min-h-screen flex flex-col">
            <div className="px-3 pt-32 sm:px-8 w-full">{children}</div>
          </div>
        </div>
      </Fragment>
    </ProtectedRoute>
  );
}

export default DashboardLayout;
