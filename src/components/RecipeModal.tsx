import { useState} from "react";
import { Recipe, Meal } from "../types";
import { useAuth } from "../Auth/AuthContext";
 import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackCircle } from "react-icons/io5";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";
import { addRecipeToMealPlan, updateMealPlanById } from "../api/mealPlanApi";
import moment from "moment";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipe: Recipe;
  selectedMeal?: Meal | null;
  setSelectedMeal?: React.Dispatch<React.SetStateAction<Meal | null>>;
  mealPlan?: Meal[];
  setMealPlan?: React.Dispatch<React.SetStateAction<Meal[]>>
}

const RecipeModal: React.FC<ModalProps> = ({ isOpen, onClose, selectedRecipe, selectedMeal, setSelectedMeal, mealPlan, setMealPlan }) => {

  const daysOfTheWeek = ["S", "M", "T", "W", "TH", "F", "S"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const [selectedDay, setSelectedDay] = useState<number>(moment().day());
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [message, setMessage] = useState<string>("");

 
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Select a day for the meal plan
  const handleDayClick = (index: number) => {
    setSelectedDay(index);
  }

  // Select a meal type
  const handleMealTypeClick = (type: string) => {
    setSelectedMealType(type);
  }

  // Add recipe to the meal plan
  const handleAddClick = async () => {
    if (session && user) {
      if (!selectedMealType) {
        showMessage("Please select meal type");
        return;
      }

      const currentDate = moment();
      
      // Prevent adding recipes to past days
      if (selectedDay < currentDate.day()) {
        showMessage("Cannot add meal plan to past days");
        return;
      }

      const date = currentDate
        .startOf("week")
        .add(selectedDay, "days")
        .format("M/DD/YYYY");

      const existingMealPlan = mealPlan?.find((meal) => meal.date === date && meal.mealType === selectedMealType);

      // Update the meal plan if a meal plan already exists for the selected date and meal type
      if (existingMealPlan && existingMealPlan.recipeId !== selectedRecipe.id) {
        const updatedMeal = await updateMealPlanById(user.id, existingMealPlan.id, session.access_token, { recipeId: selectedRecipe.id });
        if (updatedMeal) {
          showMessage(`${moment().day(selectedDay).format('dddd')} ${selectedMealType.toLowerCase()} meal plan updated successfully`);
        }
        return;
      }
      
      // Add new recipe to meal plan
      const newMeal = await addRecipeToMealPlan(
        user.id,
        session.access_token,
        selectedRecipe,
        date,
        selectedMealType
      );

      if (newMeal) {
        showMessage("Recipe added to meal plan");
      }
      const activityResponse = await fetch(`http://localhost:8080/activity/add-activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id, recipeId: selectedRecipe.id }),
      });

      const activityResult = await activityResponse.json();
      if (activityResponse.ok && activityResult.message.includes('Achievement unlocked')) {
        // Display notification for achievement unlocked
        showMessage(activityResult.message);
      }
    }
  };

  // Mark the meal as cooked
  const handleCookedClick = async () => {

    if (selectedMeal && setSelectedMeal && mealPlan) {

      // Prevent completing meals for future dates
      if (selectedMeal.date > moment().startOf('day').format("M/DD/YYYY")) {
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
          await updateMealPlanById(user.id, selectedMeal.id, session.access_token, {
            hasBeenEaten: !selectedMeal.hasBeenEaten,
          });
          setSelectedMeal(meal);
          setMealPlan(updatedMealPlan);
        } catch (error: any) {
          console.error("Error updating meal plan:", error);
        }
      } 
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
            <IoChevronBackCircle size={40} className="text-[#19243e] hover:text-slate-600 lg:hidden"/>
            <FaCircleXmark size={40} className="text-[#19243e] hover:text-slate-600 hidden lg:block"/>
          </button>

        <div className="overflow-auto h-[87vh] lg:flex lg:flex-col lg:h-3/4 lg:w-auto">

          <div className="lg:p-5 lg:flex-1 lg:flex">
            {selectedRecipe.image && 
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="mb-4 lg:w-1/3 lg:object-cover lg:mb-0"
              />
            }
            <div className="px-5">
              <h2 className="text-3xl font-bold">{selectedRecipe.name}</h2>

              {/* Nutritional Information Section */}
              <div className="flex gap-2 mb-4">
                <div className="flex flex-col items-center text-xs lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Calories: </span>{`${selectedRecipe.nutrition.calories} kcal`}</p>
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Fat: </span>{`${selectedRecipe.nutrition.macronutrients.fat.amount} g`}</p>
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Carbs: </span>{`${selectedRecipe.nutrition.macronutrients.carbs.amount} g`}</p>
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Protein: </span>{`${selectedRecipe.nutrition.macronutrients.protein.amount} g`}</p>
                </div>
              </div>

              {/* Ingredients Section */}
              <h3 className="text-xl font-bold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4 pl-4">
                {Object.entries(selectedRecipe.ingredients).map(
                  ([key, ingredient], index) => (
                    <li key={index}>
                      {ingredient.quantity} {ingredient.unit} {key}{" "}
                      {ingredient.description &&
                        `- ${ingredient.description}`}
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
                <li key={`instructions-${index}`} >
                {instruction}
                </li>
              ))}
            </ol>
          </div> 
        </div>
        
        {/* Add meal plan functionality */}
        <div className={`absolute bottom-0 left-0 w-full flex gap-2 border-t-2 p-4 lg:h-1/4 lg:justify-center lg:items-center ${!user ? "bg-amber-50 border-amber-50" : " border-gray-400"}`}>
           {user && location.pathname === "/recipes" ? (
            <>
               <div className="flex-1 flex flex-col gap-2 lg:items-center lg:flex-0">
                 <div className="flex-1 flex gap-2 items-center justify-around">
                   {daysOfTheWeek.map((day, index) => (
                     <button 
                       key={`${index}-${day}`} 
                       className={`hover:cursor-pointer text-white rounded-full size-8 lg:size-12 ${selectedDay === index ? "bg-[#19243e]": "bg-gray-400"}`}
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
                       className={`flex-1 hover:cursor-pointer text-white lg:py-2 ${selectedMealType === type ? "bg-[#19243e]": "bg-gray-400"}`}
                       onClick={() => handleMealTypeClick(type)}
                     >
                     {type}
                   </button>
                   ))}
                 </div>
               </div>
               <button className="bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 hover:cursor-pointer">
                 <h1 className="text-white" onClick={handleAddClick}>Add</h1>
               </button> 
            </>
           ) : user && location.pathname === "/meal-plan" ? (
            <div className="flex-1 flex justify-center">
              <button 
                className={` py-2 px-6 rounded-lg w-2/5 flex items-center justify-center gap-2 hover:cursor-pointer ${selectedMeal && selectedMeal.hasBeenEaten ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-400 text-gray-300"}`}
                onClick={handleCookedClick}
              >
                <FaCheckCircle />
                <h1 className={`${selectedMeal && selectedMeal.hasBeenEaten ? "text-[#ebd6aa]" : "text-gray-700"}`}>{selectedMeal && selectedMeal.hasBeenEaten ? "Cooked" : "Cooked ?"}</h1>
              </button> 
            </div>
           ) : (
            <div className="flex-1 flex flex-col gap-2 lg:items-center lg:w-full">
               <p className="text-center text-[#19243e]">Sign up or log in now to build your meal plan!</p>
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
