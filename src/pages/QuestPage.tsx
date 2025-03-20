import React, { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthContext";
import { fetchEnemyById } from "../api/enemyApi";
import { Enemy } from "../types";
import { updateUserPetStat } from "../api/userApi";
import { calcLevel } from "../util/statCalc";
import { PiSneakerMoveFill } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";
import { PiSwordFill } from "react-icons/pi";
import { FaBookOpen } from "react-icons/fa6";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FadeLoader } from "react-spinners";

const QuestPage: React.FC = () => {
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const { user, session, isLoading, setIsLoading } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState<string>("");
  const [fightResult, setFightResult] = useState<string>("");
  const [questTitle, setQuestTitle] = useState<string>("");
  const [enemyRotation, setEnemyRotation] =
    useState<string>(" w-1/2 h-auto m-3");
  const happyPet = user?.pet_img_happy;
  const sadPet = user?.pet_img_sad;
  const normalPet = user?.pet_img_normal;
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    handleGetEnemy();
  }, [user]);

  // Show message in the modal for 3 seconds
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleGetEnemy = async () => {
    setFightResult("");
    if (user) {
      setIsLoading(true);
      const newEnemyId = user.enemies_defeated + 1;

      const newEnemyIdToString = newEnemyId.toString();
      const newEnemy = await fetchEnemyById(newEnemyIdToString);
      setQuestTitle(`Fight a ${enemy?.name}!`);
      setEnemy(newEnemy);
      setIsLoading(false);
    }
  };

  // function that tells the user which stats were too low
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
      session &&
      user &&
      enemy &&
      user.pet_calorie_exp >= enemy?.calorie_exp &&
      user.pet_carb_exp >= enemy?.carb_exp &&
      user.pet_fat_exp >= enemy?.fat_exp &&
      user.pet_protein_exp >= enemy?.protein_exp &&
      user.pet_wisdom_exp >= enemy?.wisdom_exp
    ) {
      await updateUserPetStat(
        user?.id,
        user?.enemies_defeated + 1,
        "enemies_defeated",
        session?.access_token
      );
      setEnemyRotation("w-1/2 h-auto m-3 -rotate-90");
      setFightResult("win");
      setQuestTitle("You won!");
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
      setQuestTitle("You lost!");
      setFightResult("lose");
      showMessage(
        `The following stats are too low:${handleFightLossMessage()}`
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-repeat w-5/6 h-[80vh] flex items-center justify-around p-4">
        {isLoading ? (
          // Show loading spinner while data is being fetched
          <FadeLoader />
        ) : user && enemy ? (
          <div className="w-full flex flex-col items-center">
            <h1 className="font-bold text-4xl m-1 p-1">Current Quest</h1>
            <h1 className="text-4xl m-1 p-1">{questTitle}</h1>
            <img className={enemyRotation} src={enemy.img} alt="" />
            <div className="flex text-2xl mb-4 m-1">
              <h1 className="flex font-bold m-1 p-1">
                <PiSwordFill className="m-1" />
                {calcLevel(enemy.protein_exp)}
              </h1>
              <h1 className="flex font-bold m-1 p-1">
                <FaShieldAlt className="m-1" />

                {calcLevel(enemy.fat_exp)}
              </h1>

              <h1 className="flex font-bold m-1 p-1">
                <PiSneakerMoveFill className="m-1" />

                {calcLevel(enemy.carb_exp)}
              </h1>

              <h1 className="flex font-bold m-1 p-1">
                <MdEnergySavingsLeaf className="m-1" />
                {calcLevel(enemy.calorie_exp)}
              </h1>

              <h1 className="flex font-bold m-1 p-1">
                <FaBookOpen className="m-1" />

                {calcLevel(enemy.wisdom_exp)}
              </h1>
            </div>

            <button
              onClick={handleFight}
              className="bg-[url('/button-box.svg')] bg-cover bg-center h-21 w-30"
            >
              <p className="text-white text-2xl">Fight</p>
            </button>

            {/* before fight */}
            {fightResult === "" && (
              <div className="flex flex-col items-center text-2xl">
                <img
                  className="w-3/4 h-auto"
                  src={normalPet}
                  alt="normal pet"
                />
              </div>
            )}

            {/* lose message */}
            {fightResult === "lose" && (
              <div className="flex flex-col items-center text-2xl">
                <img className="w-3/4 h-auto" src={sadPet} alt="happy pet" />
                <button
                  onClick={() => {
                    navigate("/meal-plan");
                  }}
                  className="bg-[url('/button-box.svg')] bg-cover bg-center w-35 h-23 "
                >
                  <p className="text-30 text-white">Lvl Up</p>
                </button>
              </div>
            )}

            {/* win message */}
            {fightResult === "win" && (
              <div className="flex flex-col items-center text-2xl">
                <img className="w-3/4 h-auto" src={happyPet} alt="happy pet" />
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="bg-[url('/button-box.svg')] bg-cover bg-center w-35 h-23"
                >
                  <p className="text-white">Next</p>
                </button>
              </div>
            )}

            {/* Display confirmation or error message */}
            {message && (
              <div className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-2/3 z-10 rounded-sm px-5 py-2 bg-black opacity-70 min-w-3xs lg:top-3/4 lg:-translate-y-4/5">
                <p className="text-center text-white">{message}</p>{" "}
              </div>
            )}
          </div>
        ) : (
          <div>Set up your profile to begin your adventure!</div>
        )}
      </div>
    </div>
  );
};

export default QuestPage;
