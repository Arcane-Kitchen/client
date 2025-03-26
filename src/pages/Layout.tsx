import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {

  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  
  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getPaddingTop = () => {
    if (screenHeight <= 800) return "15vh";
    return "10vh";
  };

  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center min-h-screen max-h-screen flex flex-col overflow-hidden">
      <Navbar />
      <div 
        className="flex-1 overflow-y-auto lg:pt-24 flex flex-col"
        style={{
          paddingTop: getPaddingTop(),
          height: `calc(100vh - ${getPaddingTop()})`,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch"
        }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;