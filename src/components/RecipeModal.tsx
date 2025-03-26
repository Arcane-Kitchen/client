import { useState, useEffect } from "react";
import { Recipe, Meal } from "../types";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { IoChevronBackCircle, IoRemove } from "react-icons/io5";
import { FaCircleXmark, FaBookOpen } from "react-icons/fa6";
import { FaCheckCircle, FaShieldAlt } from "react-icons/fa";
import { PiSneakerMoveFill, PiSwordFill } from "react-icons/pi";
import { MdEnergySavingsLeaf } from "react-icons/md";
import {
  addRecipeToMealPlan,
  updateMealPlanById,
  removeMealFromMealPlan,
} from "../api/mealPlanApi";
import moment from "moment";
import { updateUserPetStat } from "../api/userApi";
import { addUserActivity } from "../api/activityApi";
import { handlePointCalc, handleRatioCalc } from "../util/statCalc";
import { dietColors } from "../util/constants";
import ReactDOM from "react-dom";


const baseUrl = import.meta.env.VITE_API_BASE_URL;

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipe: Recipe;
  selectedMeal?: Meal | null;
  setSelectedMeal?: React.Dispatch<React.SetStateAction<Meal | null>>;
  mealPlan: Meal[];
  setMealPlan: React.Dispatch<React.SetStateAction<Meal[]>>;
  selectedDay: number;
  setSelectedDay: React.Dispatch<React.SetStateAction<number>>;
  selectedMealType: string;
  setSelectedMealType: React.Dispatch<React.SetStateAction<string>>;
  startOfTheWeek: moment.Moment;
  finishAdding: () => void;
}

const RecipeModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  selectedRecipe,
  selectedMeal,
  setSelectedMeal,
  mealPlan,
  setMealPlan,
  selectedDay,
  setSelectedDay,
  selectedMealType,
  setSelectedMealType,
  startOfTheWeek,
  finishAdding,
}) => {
  const daysOfTheWeek = ["S", "M", "T", "W", "TH", "F", "S"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const [message, setMessage] = useState<string>("");
  const [isButtonDisabled, setButtonDisabled] = useState(false);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

  const { user, session, setUser } = useAuth();
  const navigate = useNavigate();

  // Select a day for the meal plan
  const handleDayClick = (index: number) => {
    setSelectedDay(index);
  };

  // Select a meal type
  const handleMealTypeClick = (type: string) => {
    setSelectedMealType(type);
  };

  // Handle updating stat
  const handleUpdateAllStats = async (allStats: {calorie: number, carb: number, fat: number, protein: number}, isSubtraction:boolean) => {
    if (user && session) {
      const carbRatio = handleRatioCalc(user.daily_carb_goal, allStats.carb);
      const carbPoints = handlePointCalc(carbRatio, isSubtraction);

      const fatRatio = handleRatioCalc(user.daily_fat_goal, allStats.fat);
      const fatPoints = handlePointCalc(fatRatio, isSubtraction);

      const proteinRatio = handleRatioCalc(user.daily_protein_goal, allStats.protein);
      const proteinPoints = handlePointCalc(proteinRatio, isSubtraction);

      const calorieRatio = handleRatioCalc(user.daily_calorie_goal / 3, allStats.calorie);
      const caloriePoints = handlePointCalc(calorieRatio, isSubtraction);

      await updateUserPetStat(user.id, { 
        carb: user.pet_carb_exp  + carbPoints,
        fat: user.pet_fat_exp + fatPoints,
        protein: user.pet_protein_exp + proteinPoints,
        calorie: user.pet_calorie_exp + caloriePoints
      }, session.access_token)

      return { carb: carbPoints, fat: fatPoints,  protein: proteinPoints, calorie: caloriePoints}
    }
  }

  // Add recipe to the meal plan
  const handleAddClick = async () => {
    if (session && user) {
      const currentDate = moment().startOf("day");
      const selectedDate = startOfTheWeek.clone().add(selectedDay, "days");

      // Prevent adding recipes to past days
      if (selectedDate.isBefore(currentDate)) {
        showMessage("Cannot add meal plan to past days");
        return;
      }

      try {
        setButtonDisabled(true);

        const existingMealPlan = mealPlan?.find(
          (meal) =>
            meal.date === selectedDate.format("M/DD/YYYY") &&
            meal.mealType.toLowerCase() === selectedMealType.toLowerCase()
        );

        // Update the meal plan if a meal plan already exists for the selected date and meal type
        if (
          existingMealPlan &&
          existingMealPlan.recipeId !== selectedRecipe.id
        ) {
          showMessage("Updating meal plan ...");
          const updatedMeal = await updateMealPlanById(
            user.id,
            existingMealPlan.id,
            session.access_token,
            { recipeId: selectedRecipe.id }
          );
          if (updatedMeal) {
            showMessage(
              `${moment()
                .day(selectedDay)
                .format(
                  "dddd"
                )} ${selectedMealType.toLowerCase()} meal plan updated successfully`
            );
          } else {
            showMessage("Error updating meal plan, try again");
          }
          return;
        }

        // Add new recipe to meal plan
        showMessage("Adding recipe to meal plan ...");
        const newMeal = await addRecipeToMealPlan(
          user.id,
          session.access_token,
          selectedRecipe,
          selectedDate.format("M/DD/YYYY"),
          selectedMealType
        );

        if (newMeal) {
          await updateUserPetStat(
            user.id,
            { wisdom: user.pet_wisdom_exp + 20 },
            session.access_token
          );

          showMessage(`Recipe added to meal plan: Wisdom +20`);
          setMealPlan([...mealPlan, newMeal.mealPlan]);

          // update current page user wisdom exp so that a user can add muliple recipes in a row and get all the wisdom points
          const updatedUser = { ...user };
          updatedUser.pet_wisdom_exp = updatedUser.pet_wisdom_exp + 20;
          setTimeout(() => {
            finishAdding();
            setUser(updatedUser);
            onClose();
          }, 3000);
        } else {
          showMessage("Error adding recipe to meal plan, try again");
        }

        await addUserActivity(user.id, selectedRecipe.id);
      } catch (error: any) {
        console.error("Error adding/updating meal plan:", error);
      } finally {
        setButtonDisabled(false);
        setTimeout(() => {
          finishAdding();
          onClose();
        }, 1500);
      }
    }
  };

  // Mark the meal as cooked
  const handleCookedClick = async () => {
    if (selectedMeal && setSelectedMeal && mealPlan) {
      // Prevent completing meals for future dates
      if (selectedMeal.date > moment().startOf("day").format("M/DD/YYYY")) {
        showMessage("Cannot complete a meal for a future date");
        return;
      }

      const updatedMealPlan = mealPlan.map((meal) => {
        return meal.id === selectedMeal.id
          ? { ...meal, hasBeenEaten: !meal.hasBeenEaten }
          : meal;
      });

      const meal = { ...selectedMeal };
      meal.hasBeenEaten = !selectedMeal.hasBeenEaten;

      if (user && session && setMealPlan) {
        try {
          await updateMealPlanById(
            user.id,
            selectedMeal.id,
            session.access_token,
            {
              hasBeenEaten: !selectedMeal.hasBeenEaten,
            }
          );
          
          // if meal was uneaten (this block), subtract strength, defense, dex, and stamina points (selectedMeal.hasBeenEaten is reversed)
          if (selectedMeal.hasBeenEaten) {
            // first, grab eaten meal's nutrition info
            const eatenCalories = meal.calories;
            const eatenCarbPercent = meal.macronutrients.carbs;
            const eatenFatPercent = meal.macronutrients.fat;
            const eatenProteinPercent = meal.macronutrients.protein;
            
            // next, calculate points for each stat and update
            const allPoints = await handleUpdateAllStats({ 
              calorie: eatenCalories,
              carb: eatenCarbPercent,
              fat: eatenFatPercent,
              protein: eatenProteinPercent
            }, true)
            
            showMessage(
              `Strength ${allPoints?.protein} Defense ${allPoints?.fat} Dexterity ${allPoints?.carb} Stamina ${allPoints?.calorie}`
            );

            setTimeout(() => {
              setSelectedMeal(meal);
              setMealPlan(updatedMealPlan);
              // update current page user data to make sure eating multiple things in a row gives all the points
              const updatedUser = { ...user };
              if (allPoints) {
                updatedUser.pet_protein_exp += allPoints.protein;
                updatedUser.pet_fat_exp += allPoints.fat;
                updatedUser.pet_carb_exp += allPoints.carb;
                updatedUser.pet_calorie_exp += allPoints.calorie;
              }
              setUser(updatedUser);
              onClose();
            }, 3000);
          } else if (!selectedMeal.hasBeenEaten) {
            // if meal was eaten (this block), add stats
            // first, grab eaten meal's nutrition info
            const eatenCalories = meal.calories;
            const eatenCarbPercent = meal.macronutrients.carbs;
            const eatenFatPercent = meal.macronutrients.fat;
            const eatenProteinPercent = meal.macronutrients.protein;

            // next, calculate points for each stat and update
            const allPoints = await handleUpdateAllStats({ 
              calorie: eatenCalories,
              carb: eatenCarbPercent,
              fat: eatenFatPercent,
              protein: eatenProteinPercent
            }, false)

            showMessage(
              `Strength +${allPoints?.protein} Defense +${allPoints?.fat} Dexterity +${allPoints?.carb} Stamina +${allPoints?.calorie}`
            );

            setTimeout(() => {
              // update current page user data to make sure eating multiple things in a row gives all the points
              const updatedUser = { ...user };
              if (allPoints) {
                updatedUser.pet_protein_exp += allPoints.protein;
                updatedUser.pet_fat_exp += allPoints.fat;
                updatedUser.pet_carb_exp += allPoints.carb;
                updatedUser.pet_calorie_exp += allPoints.calorie;
              }
              setUser(updatedUser);
              onClose();
            }, 3000);
          }

          // Add activity for cooking a meal
          const activityResponse = await fetch(
            `${baseUrl}/activity/add-activity`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                userId: user.id,
                recipeId: selectedRecipe.id,
                activity_type: "cook_meal",
              }),
            }
          );

          const activityResult = await activityResponse.json();
          if (
            activityResponse.ok &&
            activityResult.message.includes("Achievement unlocked")
          ) {
            // Display notification for achievement unlocked
            showMessage(activityResult.message);
          }
          // reenable cook button once finished (both in try and catch block)
          setButtonDisabled(false);
          setTimeout(() => {
            onClose();
          }, 1500);
        } catch (error: any) {
          console.error("Error updating meal plan:", error);
          setButtonDisabled(false);
        }
      }
    }
  };

  // Delete the meal from the meal plan
  const handleDelete = async () => {
    if (user && session && selectedMeal && mealPlan && setMealPlan) {
      await removeMealFromMealPlan(
        user.id,
        session.access_token,
        selectedMeal.id
      );
      const updatedMealPlan = mealPlan.filter(
        (meal) => meal.id !== selectedMeal.id
      );
      // subtract 20 points of wisdom if removing meal from plan
      await updateUserPetStat(
        user.id, { wisdom: user.pet_wisdom_exp - 20 },
        session.access_token
      );
      showMessage("Wisdom -20");
      setTimeout(() => {
        setMealPlan(updatedMealPlan);
        const updatedUser = { ...user };
        updatedUser.pet_wisdom_exp = updatedUser.pet_wisdom_exp - 20;
        setUser(updatedUser);
        onClose();
      }, 3000);
    }
  };

  // Show message in the modal for 3 seconds
  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getBottomSectionHeightStyle = () => {
    if (screenHeight <= 800) return "15vh";
    return "13vh";
  }; 

  const getMiddleSectionHeightStyle = () => {
    if (screenHeight <= 800) return "85vh";
    return "87vh";
  }

  const getPaddingStyle = () => {
    if (screenHeight <= 800) return "0.75rem";
    if (screenHeight <= 900) return "1rem";
    return "1.25rem"; 
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div 
    className="fixed inset-0 bg-black bg-opacity-50 z-[9999] w-full min-h-[100dvh] max-h-[100dvh] overflow-hidden lg:flex lg:justify-center lg:items-center"
      style={{
        // iOS-specific fixes
        position: "-webkit-sticky",
        WebkitOverflowScrolling: "touch"
      }}
    >
      <div 
        className="bg-[url('/paper-box.jpg')] bg-cover bg-center h-full w-full relative lg:rounded-lg lg:h-2/3 lg:w-1/2 lg:p-5"
      >
        {/* Close button */}
        <button
          className="fixed z-60 top-2 left-2 hover:cursor-pointer lg:left-auto lg:right-2"
          onClick={onClose}
        >
          <IoChevronBackCircle
            size={40}
            className="text-[#19243e] hover:text-slate-600 lg:hidden"
          />
          <FaCircleXmark
            size={40}
            className="text-[#19243e] hover:text-slate-600 hidden lg:block"
          />
        </button>

        <div 
          className="overflow-auto relative z-10 lg:flex lg:flex-col lg:h-3/4 lg:w-auto"
          style={{
            height: getMiddleSectionHeightStyle(),
            WebkitOverflowScrolling: "touch"
          }}
        >
          <div className="lg:p-5 lg:flex-1 lg:flex">
            {selectedRecipe.image ? (
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="mb-4 lg:w-1/3 lg:object-cover lg:mb-0"
              />
            ) : (
              <img
                className="object-cover w-full"
                src="/recipe_placeholder.png"
              />
            )}
            {selectedRecipe.diet && (
              <p
                className={`absolute top-0 right-0 text-white text-2xl px-5 py-1 ${
                  dietColors[selectedRecipe.diet]
                }`}
              >
                {selectedRecipe.diet}
              </p>
            )}
            <div className="px-5">
              <div className="flex items-center">
                <h2 className="text-3xl font-bold mr-3">
                  {selectedRecipe.name}
                </h2>
                {user && (
                  <div className="flex items-center text-2xl">
                    <FaBookOpen className="mr-2" />
                    <p>+20</p>
                  </div>
                )}
              </div>

              {/* Nutritional Information Section */}
              <div className="flex gap-2 mb-4">
                <div className="flex flex-col items-center text-xs lg:text-sm">
                  <p className="font-bold">
                    <span className="font-bold">Calories: </span>
                    {`${selectedRecipe.nutrition.calories} kcal`}
                  </p>
                  {user && (
                    <div className="flex text-base items-center mt-1">
                      <MdEnergySavingsLeaf />
                      <p className="">
                        +{" "}
                        {handlePointCalc(
                          handleRatioCalc(
                            user.daily_calorie_goal / 3,
                            selectedRecipe.nutrition.calories
                          ),
                          false
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold">
                    <span className="font-bold">Fat: </span>
                    {`${selectedRecipe.nutrition.macronutrients.fat.amount} g`}
                  </p>
                  {user && (
                    <div className="flex text-base items-center mt-1">
                      <FaShieldAlt />
                      <p>
                        +{" "}
                        {handlePointCalc(
                          handleRatioCalc(
                            user?.daily_fat_goal,
                            selectedRecipe.nutrition.macronutrients.fat
                              .percentage
                          ),
                          false
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold">
                    <span className="font-bold">Carbs: </span>
                    {`${selectedRecipe.nutrition.macronutrients.carbs.amount} g`}
                  </p>
                  {user && (
                    <div className="flex text-base items-center mt-1">
                      <PiSneakerMoveFill />
                      <p>
                        +{" "}
                        {handlePointCalc(
                          handleRatioCalc(
                            user?.daily_carb_goal,
                            selectedRecipe.nutrition.macronutrients.carbs
                              .percentage
                          ),
                          false
                        )}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold">
                    <span className="font-bold">Protein: </span>
                    {`${selectedRecipe.nutrition.macronutrients.protein.amount} g`}
                  </p>
                  {user && (
                    <div className="flex text-base items-center mt-1">
                      <PiSwordFill />
                      <p className="">
                        +{" "}
                        {handlePointCalc(
                          handleRatioCalc(
                            user?.daily_protein_goal,
                            selectedRecipe.nutrition.macronutrients.protein
                              .percentage
                          ),
                          false
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Ingredients Section */}
              <h3 className="text-xl font-bold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4 pl-4">
                {Object.entries(selectedRecipe.ingredients).map(
                  ([key, ingredient], index) => (
                    <li key={index}>
                      {ingredient.quantity} {ingredient.unit} {key}{" "}
                      {ingredient.description && `- ${ingredient.description}`}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="px-5 lg:flex-1">
            <h3 className="text-xl font-bold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside mb-4 pl-4">
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={`instructions-${index}`}>{instruction}</li>
              ))}
            </ol>
          </div>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <br></br>
        </div>

        {/* Add meal plan functionality */}
        <div
          className={`fixed z-60 bottom-0 left-0 w-full flex gap-2 border-t-2 lg:h-1/4 lg:justify-center lg:items-center ${
            !user ? "bg-amber-50 border-amber-50" : " border-gray-400 bg-[url('/paper-box.jpg')]"
          }`}
          style={{
            padding: getPaddingStyle(),
            height: getBottomSectionHeightStyle(),
            position: "sticky"
          }}
        >
          {user && selectedMeal ? (
            <div className="flex-1 flex justify-center gap-4 py-4">
              <button
                className={`py-2 px-6 rounded-lg w-2/5 flex items-center justify-center gap-2 cursor-pointer hover:scale-105 hover:shadow-lg ${
                  selectedMeal && selectedMeal.hasBeenEaten
                    ? "bg-[#19243e] text-[#ebd6aa]"
                    : "bg-gray-400 text-gray-300"
                }`}
                onClick={() => {
                  if (!isButtonDisabled) {
                    setButtonDisabled(true);
                    handleCookedClick();
                  }
                }}
              >
                <FaCheckCircle />
                <h1
                  className={`${
                    selectedMeal && selectedMeal.hasBeenEaten
                      ? "text-[#ebd6aa]"
                      : "text-gray-700"
                  }`}
                >
                  {selectedMeal && selectedMeal.hasBeenEaten
                    ? "Cooked"
                    : "Cooked ?"}
                </h1>
              </button>
              {selectedMeal &&
                moment(selectedMeal.date, "M/DD/YYYY").isSameOrAfter(
                  moment(),
                  "day"
                ) && (
                  <button
                    className={` py-2 px-6 rounded-lg w-2/5 flex items-center justify-center gap-2 cursor-pointer bg-gray-300 text-gray-700 hover:scale-105 hover:shadow-lg"}`}
                    onClick={handleDelete}
                  >
                    <IoRemove />
                    <h1>Remove</h1>
                  </button>
                )}
            </div>
          ) : user && selectedMealType ? (
            <>
              <div className="flex-1 flex flex-col gap-2 lg:items-center lg:flex-0">
                <div className="flex-1 flex gap-2 items-center justify-around">
                  {daysOfTheWeek.map((day, index) => (
                    <button
                      key={`${index}-${day}`}
                      className={`hover:cursor-pointer text-white rounded-full size-8 lg:size-12 ${
                        selectedDay === index ? "bg-[#19243e]" : "bg-gray-400"
                      }`}
                      onClick={() => handleDayClick(index)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                <div className="flex-1 flex gap-2 lg:w-full">
                  {mealTypes.map((type) => (
                    <button
                      key={type}
                      className={`flex-1 hover:cursor-pointer text-white lg:py-2 ${
                        selectedMealType.toLowerCase() === type.toLowerCase()
                          ? "bg-[#19243e]"
                          : "bg-gray-400"
                      }`}
                      onClick={() => handleMealTypeClick(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <button
                  className={`bg-[url('/button-box.svg')] bg-cover aspect-[3/2] bg-center flex-1 ${
                    isButtonDisabled ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                  onClick={isButtonDisabled ? (e) => e.preventDefault() : handleAddClick}
                >
                  <h1 className="text-white">Add</h1>
                </button>
              </div>
            </>
          ) : (
            <div 
              className="flex-1 flex flex-col gap-2 lg:items-center lg:w-full"
              style={{
                height: getBottomSectionHeightStyle(),
              }}
            >
              <div className="flex-1 flex flex-col gap-2 lg:items-center lg:w-full">
                <p className="text-center text-[#19243e]">
                  Sign up or log in now to build your meal plan!
                </p>
                <div className="flex items-center justify-center gap-2 lg:w-full">
                  <button
                    className="bg-[#19243e] text-white py-2 px-6 rounded-lg w-1/3 hover:cursor-pointer hover:scale-105 hover:shadow-lg"
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </button>
                  <button
                    className="border-1 border-[#19243e] text-[#19243e] py-2 px-6 rounded-lg w-1/3 hover:cursor-pointer hover:scale-105 hover:shadow-lg"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Display confirmation or error message */}
        {message && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-2/3 z-10 rounded-sm px-5 py-2 bg-black opacity-70 min-w-3xs lg:top-3/4 lg:-translate-y-4/5">
            <p className="text-center text-white">{message}</p>{" "}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default RecipeModal;
