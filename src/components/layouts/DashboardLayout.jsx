import { useState, Fragment } from "react";
import Sidebar from "../navigation/Sidebar";
import DashNav from "../navigation/DashNav";
import ProtectedRoute from "@/utils/protected-route";
import Footer from "../navigation/Footer";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

function DashboardLayout({ children }) {
  const [navState, setNavState] = useState(false);
  const location = useLocation();
  
  // Check if the current path is related to AI Assistant
  const isAiAssistantPath = location.pathname.includes('/user/ai-assistant');

  return (
    <ProtectedRoute>
      <Fragment>
        <DashNav setNavState={setNavState} navState={navState} />
        <div className="flex">
          <Sidebar navState={navState} />
          <div className="ml-0 sm:ml-64 w-full min-h-screen flex flex-col">
            <div className="px-3 pt-32 sm:px-8 w-full flex-grow">{children}</div>
          </div>
        </div>
        {/* Conditionally render the Footer based on path */}
        {!isAiAssistantPath && (
          <div className="ml-0 sm:ml-64">
            <Footer />
          </div>
        )}
      </Fragment>
    </ProtectedRoute>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired
};

export default DashboardLayout;
