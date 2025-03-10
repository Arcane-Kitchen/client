import React from "react";
import dragon from "../assets/cute-dragon.png";
import Achievements from "../components/Achievements";
import { useAuth } from "../Auth/AuthContext";
import { FaUser } from "react-icons/fa";


const ProfilePage: React.FC = () => {

  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('./assets/paper-box.png')] bg-repeat w-5/6 h-[70vh] flex items-center justify-around p-10">
        <div>
          <div className="flex items-center gap-10 px-10">
            <div className="bg-[url('./assets/user-box.svg')] bg-cover bg-center h-40 w-40 flex items-center justify-center">
              <FaUser color="white" size={80} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1).toLowerCase() : ''}</h1>
              <h1 className="text-3xl font-bold">Level 1</h1>
            </div>
          </div>
          <Achievements />
        </div>
        <div className="flex flex-col">
          <img className="size-40" src={dragon} alt="cute dragon" />
          <label htmlFor="calories">Calories</label>
          <progress id="calories" value={user?.pet_daily_calorie_happiness} max={100}></progress>
          <label htmlFor="carbs">Carbs</label>
          <progress id="carbs" value={user?.pet_daily_carb_happiness} max={100}></progress>
          <label htmlFor="protein">Protein</label>
          <progress id="protein" value={user?.pet_daily_protein_happiness} max={100}></progress>
          <label htmlFor="fat">Fat</label>
          <progress id="fat" value={user?.pet_daily_fat_happiness} max={100}></progress>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
