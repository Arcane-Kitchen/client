import React from "react";
import Navbar from "./Navbar";
import dragon from "../assets/cute-dragon.png";
import Achievements from "./Achievements";

const ProfilePage: React.FC = () => {
  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center pt-16">
      <Navbar />
      {/* <h1 className="text-3xl font-bold underline text-white">Profile Page</h1> */}
      {/* <img src={paper} alt="old style paper" className="w-[90dvw] h-[90dvh]" /> */}

      <div className="bg-[url('./assets/paper-box.png')] bg-repeat w-5/6 h-[70vh] flex items-center justify-around">
        <div>
          <h1 className="text-3xl font-bold">Username</h1>
          <h1 className="text-3xl font-bold">Level 1</h1>
          <Achievements />
        </div>
        <div className="flex flex-col">
          <img className="size-40" src={dragon} alt="cute dragon" />
          <label htmlFor="calories">Calories</label>
          <progress id="calories" value={50} max={100}></progress>
          <label htmlFor="carbs">Carbs</label>
          <progress id="carbs" value={50} max={100}></progress>
          <label htmlFor="protein">Protein</label>
          <progress id="protein" value={50} max={100}></progress>
          <label htmlFor="fat">Fat</label>
          <progress id="fat" value={50} max={100}></progress>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
