import React, { useState } from "react";
import { Link } from "react-router-dom";
import navbarIcon from "../assets/navbar.svg";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from 'react-router-dom';

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
        navigate('/login');
    } catch (error) {
        console.error('An error occurred: ', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-10">
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="text-white text-2xl font-bold">Arcane Kitchen</div>
        <button
          onClick={toggleNavbar}
          className="text-white focus:outline-none"
        >
          <svg
            className="w-8 h-8"
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
      {isOpen && (
        <div
          className="absolute top-0 left-0 w-full bg-cover bg-center text-white flex items-center justify-center p-4"
          style={{
            backgroundImage: `url(${navbarIcon})`,
            height: "65px",
          }}
        >
          
          {session ?  
            <>
              <Link to="/" className="px-4">
                Home
              </Link>
              <Link to="/profile" className="px-4">
                Profile
              </Link>
              <Link to="/calendar" className="px-4">
                Calendar
              </Link>
              <Link to="/recipes" className="px-4">
                Recipe List
              </Link>
              <button 
                className="text-white"
                onClick={handleLogout}>
                  Logout
              </button>
            </>
          : <>
            <Link to="/" className="px-4">
              Home
            </Link>
            <Link to="/recipes" className="px-4">
              Recipe List
            </Link>
            <Link to="/signup" className="px-4">
              Sign Up
            </Link>
            <Link to="/login" className="px-4">
              Login
            </Link>
          </>}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
