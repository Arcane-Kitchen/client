import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {

  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center min-h-screen max-h-screen flex flex-col">
      <Navbar />
      <div 
        className="flex-1 overflow-y-auto pt-[4rem] h-screen lg:pt-24 flex flex-col"
        style={{
          WebkitOverflowScrolling: "touch"
        }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;