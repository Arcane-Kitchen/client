import React, { useEffect, useState } from "react";
// import neutralDragon from "../assets/neutral.png";
// import sadDragon from "../assets/sad.png";
import { useAuth } from "../Auth/AuthContext";
import { fetchEnemyById } from "../api/enemyApi";
import { Enemy } from "../types";
import { updateUserStat } from "../api/userApi";
import { calcLevel } from "../util/statCalc";

const QuestPage: React.FC = () => {
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const { user, session } = useAuth();
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    handleGetEnemy();
  }, [user]);

  // Show message in the modal for 3 seconds
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
      window.location.reload();
    }, 3000);
  };

  const handleGetEnemy = async () => {
    if (user) {
      const newEnemyId = user.enemies_defeated + 1;
      const newEnemyIdToString = newEnemyId.toString();
      const newEnemy = await fetchEnemyById(newEnemyIdToString);
      setEnemy(newEnemy);
    }
  };

  const handleFightLossMessage = () => {
    let lowStats = "";
    if (
      enemy?.calorie_exp &&
      user &&
      user.pet_calorie_exp < enemy?.calorie_exp
    ) {
      lowStats += " calorie";
    }
    if (enemy?.carb_exp && user && user.pet_carb_exp < enemy?.carb_exp) {
      lowStats += "  carb";
    }
    if (enemy?.fat_exp && user && user.pet_fat_exp < enemy?.fat_exp) {
      lowStats += " fat";
    }
    if (
      enemy?.protein_exp &&
      user &&
      user.pet_protein_exp < enemy?.protein_exp
    ) {
      lowStats += " protein";
    }
    if (enemy?.wisdom_exp && user && user.pet_wisdom_exp < enemy?.wisdom_exp) {
      lowStats += " wisdom";
    }
    return lowStats;
  };

  const handleFight = async () => {
    if (
      user.pet_calorie_exp >= enemy?.calorie_exp &&
      user.pet_carb_exp >= enemy?.carb_exp &&
      user.pet_fat_exp >= enemy?.fat_exp &&
      user.pet_protein_exp >= enemy?.protein_exp &&
      user.pet_wisdom_exp >= enemy?.wisdom_exp
    ) {
      await updateUserStat(
        user?.id,
        user?.enemies_defeated + 1,
        "enemies_defeated",
        session?.access_token
      );
      showMessage("You won!");
    } else {
      showMessage(
        `You lost! The following stats are too low:${handleFightLossMessage()}`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[80vh] flex justify-around p-4">
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-4xl m-1 p-1">Current Quest</h1>
          <h1 className="text-4xl m-1 p-1">Defeat a {enemy?.name}!</h1>
          <img src={enemy?.img} alt="" />
          <h1 className="text-2xl font-bold m-1 p-1">
            Str: {calcLevel(enemy?.protein_exp)}
          </h1>
          <h1 className="text-2xl font-bold m-1 p-1">
            Def: {calcLevel(enemy?.fat_exp)}
          </h1>
          <h1 className="text-2xl font-bold m-1 p-1">
            Dex: {calcLevel(enemy?.carb_exp)}
          </h1>
          <h1 className="text-2xl font-bold m-1 p-1">
            Stamina: {calcLevel(enemy?.calorie_exp)}
          </h1>
          <h1 className="text-2xl font-bold m-1 p-1">
            Wis: {calcLevel(enemy?.wisdom_exp)}
          </h1>

          <button
            onClick={handleFight}
            className="m-1 p-1 w-1/4 text-2xl bg-blue-500"
          >
            Fight
          </button>
          {/* Display confirmation or error message */}
          {message && (
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-2/3 z-10 rounded-sm px-5 py-2 bg-black opacity-70 min-w-3xs lg:top-3/4 lg:-translate-y-4/5">
              <p className="text-center text-white">{message}</p>{" "}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestPage;
