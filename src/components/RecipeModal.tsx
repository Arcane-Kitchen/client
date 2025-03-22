import { useState } from "react";
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
import { fetchARecipeById } from "../api/recipeApi";
import { addUserActivity } from "../api/activityApi";
import { handlePointCalc, handleRatioCalc } from "../util/statCalc";
import { dietColors } from "../util/constants"

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

  const { user, session, isLoading, setIsLoading, setUser } = useAuth();
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
  const handleUpdateStat = async (
    statName: string,
    eatenMacroValue: number,
    isSubtraction: boolean
  ) => {
    switch (statName) {
      case "carb":
        if (user?.daily_carb_goal) {
          const ratio = handleRatioCalc(user.daily_carb_goal, eatenMacroValue);
          const points = handlePointCalc(ratio, isSubtraction);
          await updateUserPetStat(
            user.id,
            user.pet_carb_exp + points,
            "carb",
            session!.access_token
          );
          return points;
        }
        break;
      case "fat":
        if (user?.daily_fat_goal) {
          const ratio = handleRatioCalc(user.daily_fat_goal, eatenMacroValue);
          const points = handlePointCalc(ratio, isSubtraction);
          await updateUserPetStat(
            user.id,
            user.pet_fat_exp + points,
            "fat",
            session!.access_token
          );
          return points;
        }
        break;
      case "protein":
        if (user?.daily_protein_goal) {
          const ratio = handleRatioCalc(
            user.daily_protein_goal,
            eatenMacroValue
          );
          const points = handlePointCalc(ratio, isSubtraction);
          await updateUserPetStat(
            user.id,
            user.pet_protein_exp + points,
            "protein",
            session!.access_token
          );
          return points;
        }
        break;
      case "calorie":
        if (user?.daily_calorie_goal) {
          const ratio = handleRatioCalc(
            user.daily_calorie_goal / 3,
            eatenMacroValue
          );
          const points = handlePointCalc(ratio, isSubtraction);
          await updateUserPetStat(
            user.id,
            user.pet_calorie_exp + points,
            "calorie",
            session!.access_token
          );
          return points;
        }
        break;
    }
  };

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
        setIsLoading(true);

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
            user.pet_wisdom_exp + 20,
            "wisdom",
            session.access_token
          );
          showMessage(`Recipe added to meal plan: Wisdom +20`);
          setMealPlan([...mealPlan, newMeal.mealPlan]);
          // update current page user wisdom exp so that a user can add muliple recipes in a row and get all the wisdom points
          const updatedUser = { ...user };
          updatedUser.pet_wisdom_exp = updatedUser.pet_wisdom_exp + 20;
          setUser(updatedUser);
        } else {
          showMessage("Error adding recipe to meal plan, try again");
        }

        await addUserActivity(user.id, selectedRecipe.id);
      } catch (error: any) {
        console.error("Error adding/updating meal plan:", error);
      } finally {
        setIsLoading(false);
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
          setSelectedMeal(meal);
          setMealPlan(updatedMealPlan);

          // if meal was uneaten (this block), subtract strength, defense, dex, and stamina points (selectedMeal.hasBeenEaten is reversed)
          if (selectedMeal.hasBeenEaten) {
            // first, grab eaten meal's nutrition info
            const recipe = await fetchARecipeById(meal.recipeId);
            const nutrition = recipe.nutrition;
            const eatenCalories = nutrition.calories;
            const eatenCarbPercent = nutrition.macronutrients.carbs.percentage;
            const eatenFatPercent = nutrition.macronutrients.fat.percentage;
            const eatenProteinPercent =
              nutrition.macronutrients.protein.percentage;
            // next, calculate points for each stat and update
            const caloriePoints = await handleUpdateStat(
              "calorie",
              eatenCalories,
              true
            );
            const carbPoints = await handleUpdateStat(
              "carb",
              eatenCarbPercent,
              true
            );
            const fatPoints = await handleUpdateStat(
              "fat",
              eatenFatPercent,
              true
            );
            const proteinPoints = await handleUpdateStat(
              "protein",
              eatenProteinPercent,
              true
            );
            // update current page user data to make sure eating multiple things in a row gives all the points
            const updatedUser = { ...user };
            if (proteinPoints)
              updatedUser.pet_protein_exp =
                updatedUser.pet_protein_exp + proteinPoints;
            if (fatPoints)
              updatedUser.pet_fat_exp = updatedUser.pet_fat_exp + fatPoints;
            if (carbPoints)
              updatedUser.pet_carb_exp = updatedUser.pet_carb_exp + carbPoints;
            if (caloriePoints)
              updatedUser.pet_calorie_exp =
                updatedUser.pet_calorie_exp + caloriePoints;
            setUser(updatedUser);

            showMessage(
              `Strength ${proteinPoints} Defense ${fatPoints} Dexterity ${carbPoints} Stamina ${caloriePoints}`
            );
          } else if (!selectedMeal.hasBeenEaten) {
            // if meal was eaten (this block), add stats
            // first, grab eaten meal's nutrition info
            const recipe = await fetchARecipeById(meal.recipeId);
            const nutrition = recipe.nutrition;
            const eatenCalories = nutrition.calories;
            const eatenCarbPercent = nutrition.macronutrients.carbs.percentage;
            const eatenFatPercent = nutrition.macronutrients.fat.percentage;
            const eatenProteinPercent =
              nutrition.macronutrients.protein.percentage;
            // next, calculate points for each stat and update
            const caloriePoints = await handleUpdateStat(
              "calorie",
              eatenCalories,
              false
            );
            const carbPoints = await handleUpdateStat(
              "carb",
              eatenCarbPercent,
              false
            );
            const fatPoints = await handleUpdateStat(
              "fat",
              eatenFatPercent,
              false
            );
            const proteinPoints = await handleUpdateStat(
              "protein",
              eatenProteinPercent,
              false
            );
            // update current page user data to make sure eating multiple things in a row gives all the points
            const updatedUser = { ...user };
            if (proteinPoints)
              updatedUser.pet_protein_exp =
                updatedUser.pet_protein_exp + proteinPoints;
            if (fatPoints)
              updatedUser.pet_fat_exp = updatedUser.pet_fat_exp + fatPoints;
            if (carbPoints)
              updatedUser.pet_carb_exp = updatedUser.pet_carb_exp + carbPoints;
            if (caloriePoints)
              updatedUser.pet_calorie_exp =
                updatedUser.pet_calorie_exp + caloriePoints;
            setUser(updatedUser);

            showMessage(
              `Strength +${proteinPoints} Defense +${fatPoints} Dexterity +${carbPoints} Stamina +${caloriePoints}`
            );
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
      setMealPlan(updatedMealPlan);
      // subtract 20 points of wisdom if removing meal from plan
      await updateUserPetStat(
        user.id,
        user.pet_wisdom_exp - 20,
        "wisdom",
        session.access_token
      );
      const updatedUser = { ...user };
      updatedUser.pet_wisdom_exp = updatedUser.pet_wisdom_exp - 20;
      setUser(updatedUser);
      showMessage("Wisdom -20");
      setTimeout(() => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 w-vh h-vh lg:flex lg:justify-center lg:items-center">
      <div className="bg-[url('/paper-box.jpg')] bg-cover bg-center h-full w-full relative lg:rounded-lg lg:h-2/3 lg:w-1/2 lg:p-5 ">
        {/* Close button */}
        <button
          className="absolute top-2 left-2 hover:cursor-pointer lg:left-auto lg:right-2"
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

        <div className="overflow-auto h-[87vh] lg:flex lg:flex-col lg:h-3/4 lg:w-auto">
          <div className="lg:p-5 lg:flex-1 lg:flex">
            {selectedRecipe.image && (
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="mb-4 lg:w-1/3 lg:object-cover lg:mb-0"
              />
            )}
            <p className={`absolute top-0 right-0 text-white text-2xl px-5 py-1 ${dietColors[selectedRecipe.diet]}`}>{selectedRecipe.diet}</p>
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
                          ), false
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
                          ), false
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
                          ), false
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
                          ), false
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
        </div>

        {/* Add meal plan functionality */}
        <div
          className={`absolute bottom-0 left-0 w-full flex gap-2 border-t-2 p-4 lg:h-1/4 lg:justify-center lg:items-center ${
            !user ? "bg-amber-50 border-amber-50" : " border-gray-400"
          }`}
        >
          {user && selectedMeal ? (
            <div className="flex-1 flex justify-center gap-4">
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
              <button
                className={`bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 ${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={isLoading ? (e) => e.preventDefault() : handleAddClick}
              >
                <h1 className="text-white">Add</h1>
              </button>
            </>
          ) : (
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
          )}
        </div>

        {/* Display confirmation or error message */}
        {message && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 -translate-y-2/3 z-10 rounded-sm px-5 py-2 bg-black opacity-70 min-w-3xs lg:top-3/4 lg:-translate-y-4/5">
            <p className="text-center text-white">{message}</p>{" "}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeModal;
