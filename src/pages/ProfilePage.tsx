import React, { useEffect } from "react";
import happyDragon from "../assets/happy.png";
// import neutralDragon from "../assets/neutral.png";
// import sadDragon from "../assets/sad.png";
import { useAuth } from "../Auth/AuthContext";
import { MealPlan } from "../App";
import { useNavigate } from "react-router-dom";
import { fetchUserPastDayRecipes } from "../api/recipeApi";

interface ProfilePageProps {
  mealPlan: MealPlan[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ mealPlan }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    checkDailyCalories();
  }, []);

  const checkDailyCalories = async () => {
    const lastLogin = user?.updated_at;
    const currentTime = new Date(lastLogin);
    const startOfDay = new Date(lastLogin);
    startOfDay.setHours(0, 0, 0, 0);

    const recipes = await fetchUserPastDayRecipes(
      user?.id,
      startOfDay,
      currentTime
    );
    console.log(recipes);
  };

  const calcTotalExp = () => {
    let sum = 0;
    for (const meal of mealPlan) {
      if (meal.hasBeenEaten) {
        sum += meal.exp;
      }
    }
    return sum;
  };

  const calcLevel = (exp: number) => {
    const level = Math.floor(exp / 100) + 1;
    return level;
  };

  const calcRemainderExp = (exp: number) => {
    if (exp < 100) {
      return exp;
    }
    const result = exp % 100;
    return result;
  };

  // Calculate the mean happiness
  // const meanHappiness =
  //   ((user?.pet_daily_calorie_happiness ?? 0) +
  //     (user?.pet_daily_carb_happiness ?? 0) +
  //     (user?.pet_daily_protein_happiness ?? 0) +
  //     (user?.pet_daily_fat_happiness ?? 0)) /
  //   4;

  // Select the appropriate dragon image based on the mean happiness
  const dragonImage = happyDragon;
  // if (meanHappiness >= 75) {
  //   dragonImage = happyDragon;
  // } else if (meanHappiness >= 50) {
  //   dragonImage = neutralDragon;
  // } else {
  //   dragonImage = sadDragon;
  // }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[80vh] flex justify-around p-4">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-2xl">Pet Name: </h1>
          <h2 className="text-2xl">{user?.pet_name}</h2>
          <div className="flex">
            <img className="size-40" src={dragonImage} alt="dragon" />
            <div className="flex flex-col items center">
              <h1>Today:</h1>
              <div className="flex">
                <div className="bg-green-500 w-[20px] h-[20px] m-1"></div>
                <p>Go eat / plan!</p>
              </div>
              <div className="flex">
                <div className="bg-yellow-500 w-[20px] h-[20px] m-1"></div>
                <p>Done!</p>
              </div>
              <div className="flex">
                <div className="bg-red-500 w-[20px] h-[20px] m-1"></div>
                <p>Stop!</p>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-between">
            <label htmlFor="protein">
              <span className="font-bold">Strength</span> (protein)
            </label>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_protein_exp)}
              </span>
            </p>
          </div>
          <progress
            className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500 inset-shadow-sm"
            id="protein"
            value={calcRemainderExp(user?.pet_protein_exp)}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <label htmlFor="fat">
              <span className="font-bold">Defense</span> (fat)
            </label>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_fat_exp)}
              </span>
            </p>
          </div>
          <progress
            className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
            id="fat"
            value={calcRemainderExp(user?.pet_fat_exp)}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <label htmlFor="carbs">
              <span className="font-bold">Dexterity</span> (carbs)
            </label>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_calorie_exp)}
              </span>
            </p>
          </div>
          <progress
            className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
            id="carbs"
            value={calcRemainderExp(user?.pet_carb_exp)}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <label htmlFor="calories">
              <span className="font-bold">Stamina</span> (calories)
            </label>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_calorie_exp)}
              </span>
            </p>
          </div>
          <progress
            className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
            id="calories"
            value={calcRemainderExp(user?.pet_calorie_exp)}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <label htmlFor="wisdom">
              <span className="font-bold">Wisdom</span> (meal planning)
            </label>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_wisdom_exp)}
              </span>
            </p>
          </div>

          <progress
            className="w-full [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500"
            id="wisdom"
            value={calcRemainderExp(user?.pet_wisdom_exp)}
            max={100}
          ></progress>
          <h1 className="">To boost your stats: </h1>

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
