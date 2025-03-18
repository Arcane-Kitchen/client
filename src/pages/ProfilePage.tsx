import React, { useEffect, useState } from "react";
// import happyDragon from "../assets/happy.png";
// import neutralDragon from "../assets/neutral.png";
// import sadDragon from "../assets/sad.png";
import { useAuth } from "../Auth/AuthContext";
import { Meal } from "../types";
import { useNavigate } from "react-router-dom";
import { calcLevel, calcRemainderExp } from "../util/statCalc";
import { FaDumbbell } from "react-icons/fa6";
import { PiSneakerMoveFill } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";
import { PiSwordFill } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa6";
import { MdEnergySavingsLeaf } from "react-icons/md";

interface ProfilePageProps {
  mealPlan: Meal[];
}

const ProfilePage: React.FC<ProfilePageProps> = ({ mealPlan }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [strengthColor, setStrengthColor] = useState<string>(
    "[&::-webkit-progress-value]:bg-yellow-500"
  );
  const [defenseColor, setDefenseColor] = useState<string>(
    "[&::-webkit-progress-value]:bg-yellow-500"
  );
  const [dexterityColor, setDexterityColor] = useState<string>(
    "[&::-webkit-progress-value]:bg-yellow-500"
  );
  const [staminaColor, setStaminaColor] = useState<string>(
    "[&::-webkit-progress-value]:bg-yellow-500"
  );
  const [wisdomColor, setWisdomColor] = useState<string>(
    "[&::-webkit-progress-value]:bg-yellow-500"
  );

  useEffect(() => {
    checkDailyStatColors();
  }, []);

  const colorPicker = (exp: number) => {
    if (exp < 17) {
      return "[&::-webkit-progress-value]:bg-red-500";
    }
    if (exp < 34) {
      return "[&::-webkit-progress-value]:bg-orange-500";
    }
    if (exp < 51) {
      return "[&::-webkit-progress-value]:bg-amber-500";
    }
    if (exp < 68) {
      return "[&::-webkit-progress-value]:bg-yellow-500";
    }
    if (exp < 85) {
      return "[&::-webkit-progress-value]:bg-lime-500";
    }
    return "[&::-webkit-progress-value]:bg-green-500";
    // return "red";
  };

  const checkDailyStatColors = async () => {
    // using last login date that has user time zone, calculate user's current date
    const currentDay = new Date(user?.updated_at);
    const currentDayLocal = currentDay.toLocaleDateString();
    const strRemainderExp = calcRemainderExp(user?.pet_protein_exp);
    const defRemainderExp = calcRemainderExp(user?.pet_fat_exp);
    const dexRemainderExp = calcRemainderExp(user?.pet_carb_exp);
    const staminaRemainderExp = calcRemainderExp(user?.pet_calorie_exp);
    const wisRemainderExp = calcRemainderExp(user?.pet_wisdom_exp);

    // filter users meals that they have eaten today
    const todayMeals = mealPlan.filter((meal) => {
      if (meal.hasBeenEaten && meal.date === currentDayLocal) {
        return true;
      }
      return false;
    });

    // we will use this conditional to determine the color change baseed on nutrition
    // for simplicity and testing, for now, simply count number of meals eaten today
    //if user has eaten three meals today, will change to yellow

    // setStrengthColor(colorPicker(15));
    // setDefenseColor(colorPicker(33));
    // setDexterityColor(colorPicker(50));
    // setStaminaColor(colorPicker(67));
    // setWisdomColor(colorPicker(84));

    setStrengthColor(colorPicker(strRemainderExp));
    setDefenseColor(colorPicker(defRemainderExp));
    setDexterityColor(colorPicker(dexRemainderExp));
    setStaminaColor(colorPicker(staminaRemainderExp));
    setWisdomColor(colorPicker(wisRemainderExp));

    // if (todayMeals.length >= 3) {
    //   setStrengthColor("[&::-webkit-progress-value]:bg-green-500");
    //   setDefenseColor("[&::-webkit-progress-value]:bg-green-500");
    //   setDexterityColor("[&::-webkit-progress-value]:bg-green-500");
    //   setStaminaColor("[&::-webkit-progress-value]:bg-green-500");
    // } else {
    //   setStrengthColor("[&::-webkit-progress-value]:bg-yellow-500");
    //   setDefenseColor("[&::-webkit-progress-value]:bg-yellow-500");
    //   setDexterityColor("[&::-webkit-progress-value]:bg-yellow-500");
    //   setStaminaColor("[&::-webkit-progress-value]:bg-yellow-500");
    // }
  };

  // Select the appropriate dragon image based on the mean happiness
  const dragonImage = user?.pet_img_happy;
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
            {/* <div className="m-1 p-1 flex flex-col items center">
              <div className="flex">
                <div className="bg-yellow-500 w-[20px] h-[20px] m-1"></div>
                <p>Go eat / plan!</p>
              </div>
              <div className="flex">
                <div className="bg-green-500 w-[20px] h-[20px] m-1"></div>
                <p>Done for today!</p>
              </div>
            </div> */}
          </div>

          <div className="flex w-full justify-between">
            <div className="flex">
              <PiSwordFill className="m-1" />
              <label htmlFor="fat">
                <span className="font-bold">Str</span> (protein)
              </label>
            </div>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_protein_exp)}
              </span>
            </p>
          </div>
          <progress
            className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${strengthColor}`}
            id="protein"
            value={calcRemainderExp(user?.pet_protein_exp)}
            // value={15}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <div className="flex">
              <FaShieldAlt className="m-1" />
              <label htmlFor="fat">
                <span className="font-bold">Def</span> (fat)
              </label>
            </div>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_fat_exp)}
              </span>
            </p>
          </div>
          <progress
            className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${defenseColor}`}
            id="fat"
            value={calcRemainderExp(user?.pet_fat_exp)}
            // value={33}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <div className="flex">
              <PiSneakerMoveFill className="m-1" />
              <label htmlFor="carbs">
                <span className="font-bold">Dex</span> (carbs)
              </label>
            </div>

            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_carb_exp)}
              </span>
            </p>
          </div>
          <progress
            className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${dexterityColor}`}
            id="carbs"
            value={calcRemainderExp(user?.pet_carb_exp)}
            // value={50}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <div className="flex">
              <MdEnergySavingsLeaf className="m-1" />
              <label htmlFor="fat">
                <span className="font-bold">Stamina</span> (calories)
              </label>
            </div>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_calorie_exp)}
              </span>
            </p>
          </div>
          <progress
            className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${staminaColor}`}
            id="calories"
            value={calcRemainderExp(user?.pet_calorie_exp)}
            // value={67}
            max={100}
          ></progress>

          <div className="flex w-full justify-between">
            <div className="flex">
              <FaBookOpen className="m-1" />
              <label htmlFor="fat">
                <span className="font-bold">Wis</span> (planning)
              </label>
            </div>
            <p>
              <span className="font-bold">
                Lvl {calcLevel(user?.pet_wisdom_exp)}
              </span>
            </p>
          </div>

          <progress
            className={`w-full mb-7 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${wisdomColor}`}
            id="wisdom"
            value={calcRemainderExp(user?.pet_wisdom_exp)}
            // value={84}
            max={100}
          ></progress>
          <button className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 cursor-pointer p-3 mb-3">
            Go on a quest!
          </button>
          <h1 className="text-2xl">Or to boost your stats: </h1>

          <div className="m-2 p-2 w-full  flex justify-around">
            <button
              className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 cursor-pointer p-3"
              onClick={() => {
                navigate("/recipes");
              }}
            >
              Add Meals
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 active:bg-blue-800 cursor-pointer p-3"
              onClick={() => {
                navigate("/meal-plan");
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
