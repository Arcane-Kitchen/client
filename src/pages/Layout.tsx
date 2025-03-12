import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="bg-[url('/background.png')] bg-cover bg-center min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-16 h-auto flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
