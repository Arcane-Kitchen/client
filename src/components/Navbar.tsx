import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const { signOut, session } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("An error occurred: ", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 h-16 w-full z-10 lg:h-24">
      <div className="flex items-center justify-between h-full bg-[#19243e]">
        <img
          src="/navbar.svg"
          className="h-16 transform scale-y-150 relative top-0 left-0 lg:w-full lg:h-full lg:scale-y-100 lg:scale-x-145"
        />
        <div className="absolute top-0 left-0 z-20 h-full w-full flex items-center justify-between px-10 lg:px-25">
          <div className="text-[#ebd6aa] text-2xl font-bold lg:text-4xl">
            Arcane Kitchen
          </div>
          <button
            onClick={toggleNavbar}
            className="text-[#ebd6aa] focus:outline-none"
          >
            <svg
              className="w-8 h-8 cursor-pointer lg:w-12 lg:h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="absolute top-16 right-0 w-full bg-[#19243e] text-[#ebd6aa] text-lg opacity-95 p-4 lg:top-24">
          <nav className="w-full">
            <ul className="w-full flex flex-col items-center text-center">
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "hidden" : "block"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/" className="block w-full h-full">
                  Home
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "block" : "hidden"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/profile" className="block w-full h-full">
                  Profile
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "block" : "hidden"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/meal-plan" className="block w-full h-full">
                  Meal Plan
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "block" : "hidden"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/quest" className="block w-full h-full">
                  Battle
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "hidden" : "block"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/recipes" className="block w-full h-full">
                  Recipes
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "block" : "hidden"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/Achievements" className="block w-full h-full">
                  Achievements
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "block" : "hidden"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/preferences" className="block w-full h-full">
                  Preferences
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "block" : "hidden"
                }`}
                onClick={handleLogout}
              >
                Logout
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "hidden" : "block"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/signup" className="block w-full h-full">
                  Sign Up
                </Link>
              </li>
              <li
                className={`w-4/5 py-2 px-4 rounded-lg cursor-pointer hover:bg-[#264D77] hover:text-white lg:text-2xl ${
                  session ? "hidden" : "block"
                }`}
                onClick={toggleNavbar}
              >
                <Link to="/login" className="block w-full h-full">
                  Login
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Navbar;
