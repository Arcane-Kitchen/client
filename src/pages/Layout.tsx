import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <div className="bg-[url('/background.jpg')] bg-cover bg-center min-h-screen max-h-screen flex flex-col">
      <Navbar />
      <div 
        className="flex-1 overflow-y-auto lg:pt-24 flex flex-col"
        style={{
          paddingTop: window.innerHeight <= 800 ? "15vh" : "10vh",
        }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;