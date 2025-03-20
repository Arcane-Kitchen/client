import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { calcLevel, calcRemainderExp } from "../util/statCalc";
import { PiSneakerMoveFill, PiSwordFill } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { FadeLoader } from "react-spinners";

const ProfilePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const dragonImage = user?.pet_img_normal;

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
  }, [user]);

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
  };

  const checkDailyStatColors = async () => {
    if (user) {
      const strRemainderExp = calcRemainderExp(user.pet_protein_exp);
      const defRemainderExp = calcRemainderExp(user.pet_fat_exp);
      const dexRemainderExp = calcRemainderExp(user.pet_carb_exp);
      const staminaRemainderExp = calcRemainderExp(user.pet_calorie_exp);
      const wisRemainderExp = calcRemainderExp(user.pet_wisdom_exp);
  
      setStrengthColor(colorPicker(strRemainderExp));
      setDefenseColor(colorPicker(defRemainderExp));
      setDexterityColor(colorPicker(dexRemainderExp));
      setStaminaColor(colorPicker(staminaRemainderExp));
      setWisdomColor(colorPicker(wisRemainderExp));
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-cover bg-center w-5/6 min-h-[80vh] max-h-fit flex items-center justify-around p-4 py-6">
        {isLoading ? (
          // Show loading spinner while data is being fetched
          <FadeLoader />
          ) : user && (
          <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl">Pet Name: </h1>
            <h2 className="text-2xl">{user?.pet_name}</h2>
            <div className="flex">
              <img className="size-50" src={dragonImage} alt="dragon" />
            </div>
            
            {/* Pet stats */}
            <div className="w-4/5">
              {/* Strength progress bar */}
              <div className="flex w-full justify-between">
                <div className="flex">
                  <PiSwordFill className="m-1" />
                  <label htmlFor="fat">
                    <span className="font-bold">Str</span> (protein)
                  </label>
                </div>
                <p>
                  <span className="font-bold">
                    Lvl {calcLevel(user.pet_protein_exp)}
                  </span>
                </p>
              </div>
              <progress
                className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${strengthColor}`}
                id="protein"
                value={calcRemainderExp(user.pet_protein_exp)}
                max={100}
              ></progress>

              {/* Defense progress bar */}
              <div className="flex w-full justify-between">
                <div className="flex">
                  <FaShieldAlt className="m-1" />
                  <label htmlFor="fat">
                    <span className="font-bold">Def</span> (fat)
                  </label>
                </div>
                <p>
                  <span className="font-bold">
                    Lvl {calcLevel(user.pet_fat_exp)}
                  </span>
                </p>
              </div>
              <progress
                className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${defenseColor}`}
                id="fat"
                value={calcRemainderExp(user.pet_fat_exp)}
                max={100}
              ></progress>

              {/* Dexterity progress bar */}
              <div className="flex w-full justify-between">
                <div className="flex">
                  <PiSneakerMoveFill className="m-1" />
                  <label htmlFor="carbs">
                    <span className="font-bold">Dex</span> (carbs)
                  </label>
                </div>

                <p>
                  <span className="font-bold">
                    Lvl {calcLevel(user.pet_carb_exp)}
                  </span>
                </p>
              </div>
              <progress
                className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${dexterityColor}`}
                id="carbs"
                value={calcRemainderExp(user!.pet_carb_exp)}
                max={100}
              ></progress>

              {/* Stamina progress bar */}
              <div className="flex w-full justify-between">
                <div className="flex">
                  <MdEnergySavingsLeaf className="m-1" />
                  <label htmlFor="fat">
                    <span className="font-bold">Stamina</span> (calories)
                  </label>
                </div>
                <p>
                  <span className="font-bold">
                    Lvl {calcLevel(user.pet_calorie_exp)}
                  </span>
                </p>
              </div>
              <progress
                className={`w-full mb-1 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${staminaColor}`}
                id="calories"
                value={calcRemainderExp(user.pet_calorie_exp)}
                max={100}
              ></progress>

              {/* Wisdom progress bar */}
              <div className="flex w-full justify-between">
                <div className="flex">
                  <FaBookOpen className="m-1" />
                  <label htmlFor="fat">
                    <span className="font-bold">Wis</span> (planning)
                  </label>
                </div>
                <p>
                  <span className="font-bold">
                    Lvl {calcLevel(user.pet_wisdom_exp)}
                  </span>
                </p>
              </div>
              <progress
                className={`w-full mb-7 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-webkit-progress-bar]:bg-gray-300 ${wisdomColor}`}
                id="wisdom"
                value={calcRemainderExp(user.pet_wisdom_exp)}
                max={100}
              ></progress>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center gap-2">
              {/* Quest button */}
              <button
                onClick={() => {
                  navigate("/quest");
                }}
                className="bg-[url('/button-box.svg')] bg-cover bg-center w-35 h-23"
              >
                <p className="text-white text-2xl">Quest</p>
              </button>
              
              {/* Plan button */}
              <button
                className="bg-[url('/button-box.svg')] bg-cover bg-center w-35 h-23"
                onClick={() => {
                  navigate("/meal-plan");
                }}
              >
                <p className="text-white text-2xl">Plan</p>
              </button>
            </div>
            
          </div>
          )
        }
      </div>
    </div>
  );
};

export default ProfilePage;
