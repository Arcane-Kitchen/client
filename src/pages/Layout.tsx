import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {

  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center min-h-dvh max-h-dvh overflow-hidden">
      <Navbar />
      <div 
        className="overflow-y-auto pt-[4rem] h-[calc(100dvh - 4rem)] lg:pt-24 flex flex-col"
        style={{
          WebkitOverflowScrolling: "touch"
        }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;