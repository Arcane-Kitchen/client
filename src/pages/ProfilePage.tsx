import React, { useEffect, useState } from "react";
import happyDragon from "../assets/happy.png";
import neutralDragon from "../assets/neutral.png";
import sadDragon from "../assets/sad.png";
import { useAuth } from "../Auth/AuthContext";
import { MealPlan } from "../App";
import { useNavigate } from "react-router-dom";

interface ProfilePageProps {
  mealPlan: MealPlan[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ mealPlan }) => {
  const { user } = useAuth();
  const [userTotalExp, setUserTotalExp] = useState<number>(0);
  const navigate = useNavigate();

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
      <div className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[70vh] flex justify-around p-4">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl">Pet Name: </h1>
          <h2 className="text-2xl">Dino the Dragon</h2>
          <img className="size-40" src={dragonImage} alt="dragon" />
          <label htmlFor="calories">
            <span className="font-bold">Calories</span> Lvl 1
          </label>
          <progress
            className="w-19/20"
            id="calories"
            value={20}
            max={100}
          ></progress>
          <label htmlFor="carbs">
            <span className="font-bold">Carbs</span> Lvl 1
          </label>
          <progress
            className="w-19/20"
            id="carbs"
            value={30}
            max={100}
          ></progress>
          <label htmlFor="protein">
            <span className="font-bold">Protein</span> Lvl 1
          </label>
          <progress
            className="w-19/20"
            id="protein"
            value={40}
            max={100}
          ></progress>
          <label htmlFor="fat">
            <span className="font-bold">Fat</span> Lvl 1
          </label>
          <progress
            className="w-19/20"
            id="fat"
            value={35}
            max={100}
          ></progress>
          <h1 className="">To level up: </h1>

          <div className="m-2 p-2 w-full  flex justify-around">
            <button
              className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 cursor-pointer p-1"
              onClick={() => {
                navigate("/recipes");
              }}
            >
              Add Meals
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 cursor-pointer p-1"
              onClick={() => {
                navigate("/calendar");
              }}
            >
              Eat Meals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
