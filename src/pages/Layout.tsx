import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center min-h-screen max-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16 h-auto flex-1 overflow-y-auto lg:pt-24 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;