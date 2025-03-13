import React, { useEffect, useState } from "react";
import happyDragon from "../assets/happy.png";
import neutralDragon from "../assets/neutral.png";
import sadDragon from "../assets/sad.png";
import Achievements from "../components/Achievements";
import { useAuth } from "../Auth/AuthContext";
import { FaUser } from "react-icons/fa";
import { MealPlan } from "../App";

interface ProfilePageProps {
  mealPlan: MealPlan[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ mealPlan }) => {
  const { user } = useAuth();
  const [userTotalExp, setUserTotalExp] = useState<number>(0);

  useEffect(() => {
    const totalExp = calcTotalExp();
    setUserTotalExp(totalExp);
  }, []);

  const calcTotalExp = () => {
    let sum = 0;
    for (const meal of mealPlan) {
      if (meal.hasBeenEaten) {
        sum += meal.exp;
      }
    }
    return sum;
  };

  const calcLevel = () => {
    const level = Math.floor(userTotalExp / 100) + 1;
    return level;
  };

  const calcRemainderExp = () => {
    if (userTotalExp < 100) {
      return userTotalExp;
    }
    const result = userTotalExp % 100;
    return result;
  };

  // Calculate the mean happiness
  const meanHappiness =
    ((user?.pet_daily_calorie_happiness ?? 0) +
      (user?.pet_daily_carb_happiness ?? 0) +
      (user?.pet_daily_protein_happiness ?? 0) +
      (user?.pet_daily_fat_happiness ?? 0)) /
    4;

  // Select the appropriate dragon image based on the mean happiness
  let dragonImage;
  if (meanHappiness >= 75) {
    dragonImage = happyDragon;
  } else if (meanHappiness >= 50) {
    dragonImage = neutralDragon;
  } else {
    dragonImage = sadDragon;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.png')] bg-repeat w-5/6 h-[70vh] flex justify-around p-4">
        {/* <div>
          <div className="flex items-center gap-10 px-10">
            <div className="bg-[url('/user-box.svg')] bg-cover bg-center h-40 w-40 flex items-center justify-center">
              <FaUser color="white" size={80} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user?.username
                  ? user.username.charAt(0).toUpperCase() +
                    user.username.slice(1).toLowerCase()
                  : ""}
              </h1>
              <h1 className="text-3xl font-bold">Level {calcLevel()}</h1>
              <h2 className="text-2xl">Exp: {calcRemainderExp()}</h2>
            </div>
          </div>
        </div> */}
        <div className="flex flex-col mt-15">
          <label htmlFor="calories">Calorie Lvl 1</label>
          <progress
            className="w-20"
            id="calories"
            value={user?.pet_daily_calorie_happiness}
            max={100}
          ></progress>
          <label htmlFor="carbs">Carb Lvl 1</label>
          <progress
            className="w-20"
            id="carbs"
            value={user?.pet_daily_carb_happiness}
            max={100}
          ></progress>
          <label htmlFor="protein">Protein Lvl 1</label>
          <progress
            className="w-20"
            id="protein"
            value={user?.pet_daily_protein_happiness}
            max={100}
          ></progress>
          <label htmlFor="fat">Fat Lvl 1</label>
          <progress
            className="w-20"
            id="fat"
            value={user?.pet_daily_fat_happiness}
            max={100}
          ></progress>
        </div>
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl">Pet Name: </h1>
          <h2 className="text-2xl">Dino the Dragon</h2>
          <img className="size-40" src={dragonImage} alt="dragon" />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
