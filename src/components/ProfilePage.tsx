import React from "react";
import Navbar from "./Navbar";

const ProfilePage: React.FC = () => {
  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center pt-16">
      <Navbar />
      <h1 className="text-3xl font-bold underline text-white">Profile Page</h1>
      {/* <img src={paper} alt="old style paper" className="w-[90dvw] h-[90dvh]" /> */}

      <div className="bg-[url('./assets/old-style-paper.png')] w-[90dvw] h-[90dvh]"></div>
    </div>
  );
};

export default ProfilePage;
