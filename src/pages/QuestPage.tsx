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
  };

  const handleFight = () => {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[80vh] flex justify-around p-4">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl">{enemy?.name}</h1>
          <img src={enemy?.img} alt="" />
          <button onClick={handleFight} className="m-1 p-1 w-1/4 bg-blue-500">
            Fight
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestPage;
