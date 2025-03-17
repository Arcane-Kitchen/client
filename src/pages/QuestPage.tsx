import React, { useEffect, useState } from "react";
// import neutralDragon from "../assets/neutral.png";
// import sadDragon from "../assets/sad.png";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchEnemyById } from "../api/enemyApi";
import { Enemy } from "../types";

const QuestPage: React.FC = () => {
  const { user } = useAuth();
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    handleGetEnemy();
    // console.log(enemy);
  }, []);

  const handleGetEnemy = async () => {
    const newEnemy = await fetchEnemyById("1");
    setEnemy(newEnemy);
    console.log(user);
    console.log(enemy);
  };

  const handleFight = () => {
    if (
      user.pet_calorie_exp >= enemy?.calorie_exp &&
      user.pet_carb_exp >= enemy?.carb_exp &&
      user.pet_fat_exp >= enemy?.fat_exp &&
      user.pet_protein_exp >= enemy?.protein_exp &&
      user.pet_wisdom_exp >= enemy?.wisdom_exp
    ) {
      console.log("you win!");
    } else {
      console.log("you lose :(");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[80vh] flex justify-around p-4">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl">{enemy?.name}</h1>
          <img src={enemy?.img} alt="" />
          <button
            onClick={() => {
              handleFight();
            }}
            className="m-1 p-1 w-1/4 bg-blue-500"
          >
            Fight
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestPage;
