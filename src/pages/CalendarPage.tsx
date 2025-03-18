import { useState } from "react";
import moment from "moment";
import { useAuth } from "../Auth/AuthContext";
import { PacmanLoader } from "react-spinners";
import { Meal, Recipe } from "../types";
import { FaCheckCircle, FaPlus } from "react-icons/fa";
import RecipeModal from "../components/RecipeModal";
import RecipesPage from "./RecipesPage";

interface CalendarPageProps {
  recipes: Recipe[]
  mealPlan: Meal[];
  filteredRecipes: Recipe[];
  setMealPlan: React.Dispatch<React.SetStateAction<Meal[]>>;
  setFilteredRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ mealPlan, setMealPlan, recipes, filteredRecipes, setFilteredRecipes }) => {
  const { isLoading } = useAuth();

  const [currentStartOfWeek, setCurrentStartOfWeek] = useState<moment.Moment>(moment().startOf("week"));
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedDay, setSelectedDay] = useState<number>(moment().day());
  const [selectedMealType, setSelectedMealType] = useState<string>("");
  const [isAdding, setIsAdding] = useState<boolean>(false);

  // Generate the days of the current week to display on the calendar
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    let day = currentStartOfWeek.clone().add(i, "days");
    daysOfWeek.push(day.format("ddd DD"));
  }

  // Open the modal and set the selected recipe and meal
  const handleClick = (meal: Meal) => {
    const recipe = recipes.find((recipe) => recipe.id === meal.recipeId)
    setSelectedRecipe(recipe);
    setSelectedMeal(meal)
    setIsModalOpen(true);
  }

  // Close the modal and reset selected recipe
  const closeModal = () => {
    setSelectedRecipe(undefined);
    setSelectedMeal(null);
    setIsModalOpen(false);
  };

  const handleAddClick = (day: number, type: string) => {
    setSelectedDay(day);
    setSelectedMealType(type);
    setIsAdding(true);
  }

  const finishAdding = () => {
    setIsAdding(false);
  }

  return (
    !isAdding ? (<div className="h-fit flex flex-col items-center justify-center p-10 ">
      <div className="flex-1 bg-[url('/paper-box.jpg')] bg-cover bg-center w-full p-5 lg:p-15">
        {isLoading ? (
          // Show loading spinner while data is being fetched
          <PacmanLoader />
        ) : (
          <div className="flex flex-col">
            <h3 className="text-2xl mb-2">{`${currentStartOfWeek.format("MMMM DD")} - ${currentStartOfWeek.clone().add(6, "days").format("DD")}`}</h3>

            {/* Navigation buttons for changing the week */}
            <div className="flex items-center border-1 border-gray-300 divide-x-1 divide-gray-300 mb-5 w-full rounded-md lg:w-3/4">
              {/* Back button */}
              <button 
                className="flex-1 py-1 rounded-tl-md rounded-bl-md cursor-pointer hover:bg-[#19243e] hover:text-[#ebd6aa] hover:scale-105 hover:shadow-lg"
                onClick={() => setCurrentStartOfWeek(currentStartOfWeek.clone().subtract(7, "days").startOf("week"))}
              >
                Back
              </button>
              {/* Current Week button */}
              <button 
                className={`flex-1 py-1 ${currentStartOfWeek.isSame(moment().startOf("week")) ? "bg-[#19243e] text-[#ebd6aa]" : "hover:scale-105 hover:cursor-pointer hover:bg-[#19243e] hover:text-[#ebd6aa] hover:shadow-lg"}`}
                onClick={() => setCurrentStartOfWeek(moment().startOf("week"))}
              >
                Current Week
              </button>
              {/* Next button */}
              <button 
                className="flex-1 py-1 rounded-tr-md rounded-br-md hover:cursor-pointer hover:bg-[#19243e] hover:text-[#ebd6aa] hover:scale-105 hover:shadow-lg"
                onClick={() => setCurrentStartOfWeek(currentStartOfWeek.clone().add(7, "days").startOf("week"))}
              >
                Next
              </button>
            </div>

            {/* Calendar display */}
            <div className="flex flex-col border-l-1 border-r-1 border-gray-300 lg:flex-row lg:border-b-1 lg:border-r-0">
              {/* Meal type header (Breakfast, Lunch, Dinner) */}
              <div className="flex w-full lg:flex-col lg:w-3xl lg:divide-x-1 lg:divide-y-1 lg:divide-gray-300">
                <div className="w-1/4 bg-[#19243e] lg:w-full lg:h-1/13"></div>
                {["Breakfast", "Lunch", "Dinner"].map((type) => (
                  <div key={type} className="w-1/4 bg-[#19243e] text-[#ebd6aa] text-center lg:w-full lg:flex-1 lg:text-left lg:px-2 lg:bg-transparent lg:text-[#19243e] lg:text-lg lg:flex lg:items-center">{type}</div>
                ))}
              </div>
              
              {/* Day headers and meal cells */}
              {daysOfWeek.map((day, index) => {
                return (
                  <div key={day} className="flex w-full lg:flex-col border-b-1 border-gray-300 divide-x-1 divide-gray-300 lg:divide-y-1 lg:border-b-0">
                    {/* Day header (e.g., Mon 01) */}
                    <div className="w-1/4 flex items-center p-2 lg:w-full lg:text-center lg:bg-[#19243e] lg:text-[#ebd6aa]">
                      <p className="flex-1">{day}</p>
                    </div>

                    {/* Meal types (Breakfast, Lunch, Dinner) for each day */}
                    {["breakfast", "lunch", "dinner"].map((type) => {
                      const weeklyMeals = mealPlan.filter((meal) => {
                        return meal.date === currentStartOfWeek.clone().add(index, "days").format("M/DD/YYYY") && meal.mealType.toLowerCase() === type;
                      })
                      
                      // If there are no meals for the day and meal type, show an empty space
                      if (weeklyMeals.length === 0) {
                        return (
                          <div key={`${day}-${type}`} className="w-1/4 h-20 flex items-center justify-center text-gray-400 cursor-pointer lg:w-full lg:h-40" onClick={() => handleAddClick(index, type)}><FaPlus /></div>
                        );
                      }

                      // Display the image of the meal
                      return weeklyMeals.map((meal) => (
                        <div key={`${day}-${type}-${meal.id}`} className="w-1/4 h-20 p-1 relative lg:w-full lg:h-40">
                          <div 
                            className="w-full h-full text-center bg-cover bg-center hover:cursor-pointer" 
                            style={{ backgroundImage: `url(${meal.imageUrl})` }}
                            onClick={() => handleClick(meal)} // Open modal on meal click
                          >
                          </div>
                          {/* Display a check circle if the meal has been eaten */}
                          {meal.hasBeenEaten && <FaCheckCircle color="green" className="absolute bottom-0.5 right-0.5 lg:text-2xl"/>}
                        </div>
                      ))
                    })
                    }
                  </div>
                );
              })}
            </div>
            
            {/* Display the modal if a recipe is selected */}
            {selectedRecipe && <RecipeModal 
              isOpen={isModalOpen} 
              onClose={closeModal} 
              selectedRecipe={selectedRecipe} 
              selectedMeal={selectedMeal} 
              setSelectedMeal={setSelectedMeal} 
              mealPlan={mealPlan} 
              setMealPlan={setMealPlan}
              selectedDay={selectedDay}
              setSelectedDay={setSelectedDay}
              selectedMealType={selectedMealType}
              setSelectedMealType={setSelectedMealType}
              startOfTheWeek={currentStartOfWeek}
              finishAdding={finishAdding}
            /> }
          </div>
        )}
      </div>
    </div>
  
    ) : (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 w-vh h-vh lg:flex lg:justify-center lg:items-center">
        <div className="bg-[url('/background.jpg')] bg-cover bg-center h-full w-full relative lg:rounded-lg lg:h-2/3 lg:w-1/2 lg:p-5 overflow-y-auto">          
          <RecipesPage
            recipes={recipes}
            mealPlan={mealPlan}
            setMealPlan={setMealPlan}
            filteredRecipes={filteredRecipes}
            setFilteredRecipes={setFilteredRecipes}
            finishAdding={finishAdding}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            selectedMealType={selectedMealType}
            setSelectedMealType={setSelectedMealType}
            startOfTheWeek={currentStartOfWeek}
          />
        </div>
      </div>
    )
  )
};

export default CalendarPage;
