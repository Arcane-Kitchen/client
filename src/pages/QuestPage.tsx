import React, { useEffect, useState } from "react";
// import neutralDragon from "../assets/neutral.png";
// import sadDragon from "../assets/sad.png";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchEnemyById } from "../api/enemyApi";

const QuestPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    handleGetEnemy();
  }, []);

  const handleGetEnemy = async () => {
    const enemy = await fetchEnemyById("1");
    console.log(enemy);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[80vh] flex justify-around p-4">
        <div></div>
      </div>
    </div>
  );
};

export default QuestPage;
