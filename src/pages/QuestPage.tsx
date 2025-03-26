import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { Enemy } from "../types";
import { updateUserPetStat } from "../api/userApi";
import { calcLevel } from "../util/statCalc";
import { PiSneakerMoveFill } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";
import { PiSwordFill } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa6";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { enemies, enemyProfile } from "../util/constants";

const QuestPage: React.FC = () => {
  const { user, session, setUser } = useAuth();
  const navigate = useNavigate();
  
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [fightResult, setFightResult] = useState<string>("");
  const [defeatedEnemies, setDefeatedEnemies] = useState<number>(0);

  const [petStrColor, setPetStrColor] = useState<string>(
    "flex font-bold m-1 p-1"
  );
  const [petDefColor, setPetDefColor] = useState<string>(
    "flex font-bold m-1 p-1"
  );
  const [petDexColor, setPetDexColor] = useState<string>(
    "flex font-bold m-1 p-1"
  );
  const [petStaminaColor, setPetStaminaColor] = useState<string>(
    "flex font-bold m-1 p-1"
  );
  const [petWisColor, setPetWisColor] = useState<string>(
    "flex font-bold m-1 p-1"
  );

  const happyPet = user?.pet_img_happy;
  const sadPet = user?.pet_img_sad;
  const normalPet = user?.pet_img_normal;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (user) {
      setDefeatedEnemies(user.enemies_defeated);
    }
  }, []);

  useEffect(() => {
    if (defeatedEnemies >= 0) {
      const currentEnemy = enemies[defeatedEnemies];
      setEnemy(enemyProfile[currentEnemy]);
    }
  }, [defeatedEnemies]);

  const handleNext = () => {
    setFightResult("");
    setDefeatedEnemies(defeatedEnemies + 1);
  }

  // function that tells the user which stats were too low
  const handleFightLoss = () => {
    if (enemy && user && user.pet_calorie_exp < enemy.stats.calorieExp) {
      setPetStaminaColor("flex font-bold m-1 p-1 text-red-500");
    }
    if (enemy && user && user.pet_carb_exp < enemy.stats.carbExp) {
      setPetDexColor("flex font-bold m-1 p-1 text-red-500");
    }
    if (enemy && user && user.pet_fat_exp < enemy.stats.fatExp) {
      setPetDefColor("flex font-bold m-1 p-1 text-red-500");
    }
    if (enemy && user && user.pet_protein_exp < enemy.stats.proteinExp) {
      setPetStrColor("flex font-bold m-1 p-1 text-red-500");
    }
    if (enemy && user && user.pet_wisdom_exp < enemy.stats.wisdomExp) {
      setPetWisColor("flex font-bold m-1 p-1 text-red-500");
    }
  };

  const handleFight = async () => {
    if (
      session &&
      user &&
      enemy &&
      user.pet_calorie_exp >= enemy.stats.calorieExp &&
      user.pet_carb_exp >= enemy.stats.carbExp &&
      user.pet_fat_exp >= enemy.stats.fatExp &&
      user.pet_protein_exp >= enemy.stats.proteinExp &&
      user.pet_wisdom_exp >= enemy.stats.wisdomExp
    ) {
      await updateUserPetStat(
        user.id, 
        { enemiesDefeated: user.enemies_defeated + 1},
        session.access_token
      );
      setFightResult("win");

      const updatedUser = { ...user };
      updatedUser.enemies_defeated = defeatedEnemies + 1;
      setUser(updatedUser);

      // Add activity to User_Activity table
      try {
        const response = await fetch(`${baseUrl}/activity/add-activity`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            userId: user?.id,
            recipeId: 2,
            activity_type: "fight_win",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to add activity");
        }
      } catch (error) {
        console.error("Error adding activity:", error);
      }
    } else {
      setFightResult("lose");
      handleFightLoss();
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center pb-16 pt-8">
      <div className="bg-[url('/paper-box.jpg')] bg-cover bg-center w-5/6 min-h-[80vh] max-h-fit flex items-center justify-around p-4">
        {user && !user.pet_name ? (
          <div className="flex-1 flex flex-col items-center gap-2 p-2">
            <div className="bg-[url('/wizard.jpg')] bg-cover bg-center rounded-full w-2/5 aspect-square"></div>
            <h1 className="text-2xl text-center mb-5">
              Ah, brave traveler! Almost there—finish setting up your profile,
              and you’ll be ready to embark on your journey!
            </h1>
            <button
              className="bg-[url('/button-box.svg')] bg-center bg-cover h-20 w-30"
              onClick={() => navigate("/preferences")}
            >
              <h1 className="text-white text-base/5">
                Set <br /> Preferences
              </h1>
            </button>
          </div>
        ) : (
          user && enemy && (
            <div className="w-full flex flex-col items-center">
              <h1 className="font-bold text-4xl m-1 p-1">Battle</h1>
              <h1 className="text-4xl m-1 p-1">
                {fightResult === "lose" 
                  ? "You lost!" 
                  : fightResult === "win" 
                  ? "You won!" 
                  : `Fight a ${enemies[defeatedEnemies]}!`
                }
              </h1>
              <div className="w-2/3 aspect-square flex items-center">
                {enemies.map((enemy, index) => (
                  <img 
                    key={enemy} 
                    className={`w-full h-full m-3 ${fightResult ==="win" && "-rotate-90"} ${defeatedEnemies === index ? "block" : "hidden"}`} 
                    src={enemyProfile[enemy].imageUrl} 
                    alt={enemy} 
                  />
                ))}
              </div>
              <div className="flex text-2xl mb-4 m-1">
                <h1 className="flex font-bold m-1 p-1">
                  <PiSwordFill className="m-1" />
                  {calcLevel(enemy.stats.proteinExp)}
                </h1>
                <h1 className="flex font-bold m-1 p-1">
                  <FaShieldAlt className="m-1" />

                  {calcLevel(enemy.stats.fatExp)}
                </h1>

                <h1 className="flex font-bold m-1 p-1">
                  <PiSneakerMoveFill className="m-1" />

                  {calcLevel(enemy.stats.carbExp)}
                </h1>

                <h1 className="flex font-bold m-1 p-1">
                  <MdEnergySavingsLeaf className="m-1" />
                  {calcLevel(enemy.stats.calorieExp)}
                </h1>

                <h1 className="flex font-bold m-1 p-1">
                  <FaBookOpen className="m-1" />

                  {calcLevel(enemy.stats.wisdomExp)}
                </h1>
              </div>

              {/* before fight */}
              {fightResult === "" && (
                <div className="flex flex-col items-center text-2xl">
                  <button
                    onClick={handleFight}
                    className="bg-[url('/button-box.svg')] bg-cover bg-center h-21 w-30"
                  >
                    <p className="text-white text-2xl">Fight</p>
                  </button>
                  <div className="w-3/4 aspect-square">
                    <img
                      className="w-full h-full"
                      src={normalPet}
                      alt="normal pet"
                    />
                  </div>
                  <div className="flex text-2xl mb-4 m-1">
                    <h1 className={petStrColor}>
                      <PiSwordFill className="m-1" />
                      {calcLevel(user.pet_protein_exp)}
                    </h1>
                    <h1 className={petDefColor}>
                      <FaShieldAlt className="m-1" />

                      {calcLevel(user.pet_fat_exp)}
                    </h1>

                    <h1 className={petDexColor}>
                      <PiSneakerMoveFill className="m-1" />

                      {calcLevel(user.pet_carb_exp)}
                    </h1>

                    <h1 className={petStaminaColor}>
                      <MdEnergySavingsLeaf className="m-1" />
                      {calcLevel(user.pet_calorie_exp)}
                    </h1>

                    <h1 className={petWisColor}>
                      <FaBookOpen className="m-1" />

                      {calcLevel(user.pet_wisdom_exp)}
                    </h1>
                  </div>
                </div>
              )}

              {/* lose message */}
              {fightResult === "lose" && (
                <div className="flex flex-col items-center text-2xl">
                  <button
                    onClick={() => {
                      navigate("/meal-plan");
                    }}
                    className="bg-[url('/button-box.svg')] bg-cover bg-center w-35 h-23 "
                  >
                    <p className="text-30 text-white">Lvl Up</p>
                  </button>
                  <div className="w-3/4 aspect-square">
                    <img className="w-full h-full" src={sadPet} alt="happy pet" />
                  </div>
                  <div className="flex text-2xl mb-4 m-1">
                    <h1 className={petStrColor}>
                      <PiSwordFill className="m-1" />
                      {calcLevel(user.pet_protein_exp)}
                    </h1>
                    <h1 className={petDefColor}>
                      <FaShieldAlt className="m-1" />

                      {calcLevel(user.pet_fat_exp)}
                    </h1>

                    <h1 className={petDexColor}>
                      <PiSneakerMoveFill className="m-1" />

                      {calcLevel(user.pet_carb_exp)}
                    </h1>

                    <h1 className={petStaminaColor}>
                      <MdEnergySavingsLeaf className="m-1" />
                      {calcLevel(user.pet_calorie_exp)}
                    </h1>

                    <h1 className={petWisColor}>
                      <FaBookOpen className="m-1" />

                      {calcLevel(user.pet_wisdom_exp)}
                    </h1>
                  </div>
                </div>
              )}

              {/* win message */}
              {fightResult === "win" && (
                <div className="flex flex-col items-center text-2xl">
                  <button
                    onClick={handleNext}
                    className="bg-[url('/button-box.svg')] bg-cover bg-center w-35 h-23"
                  >
                    <p className="text-white">Next</p>
                  </button>
                  <div className="w-3/4 aspect-square">
                    <img
                      className="w-full h-full"
                      src={happyPet}
                      alt="happy pet"
                    />
                  </div>
                  <div className={petStrColor}>
                    <h1 className="flex font-bold m-1 p-1">
                      <PiSwordFill className="m-1" />
                      {calcLevel(user.pet_protein_exp)}
                    </h1>
                    <h1 className={petDefColor}>
                      <FaShieldAlt className="m-1" />

                      {calcLevel(user.pet_fat_exp)}
                    </h1>

                    <h1 className={petDexColor}>
                      <PiSneakerMoveFill className="m-1" />

                      {calcLevel(user.pet_carb_exp)}
                    </h1>

                    <h1 className={petStaminaColor}>
                      <MdEnergySavingsLeaf className="m-1" />
                      {calcLevel(user.pet_calorie_exp)}
                    </h1>

                    <h1 className={petWisColor}>
                      <FaBookOpen className="m-1" />

                      {calcLevel(user.pet_wisdom_exp)}
                    </h1>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default QuestPage;
