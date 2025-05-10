import Navbar from "../navigation/Navbar";
import Footer from "../navigation/Footer";

// eslint-disable-next-line react/prop-types
function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <div className="flex-grow">
        <Navbar />
        {children}
      </div>
      <Footer />
    </div>
  );
}

export default MainLayout;
