import React, { useEffect, useState } from "react";
import { fetchAllRecipes } from "../api/recipeApi";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import {
  addRecipeToMealPlan,
  updateMealPlanByDateAndMealType,
} from "../api/mealPlanApi";
import { useAuth } from "../Auth/AuthContext";
import { MealPlan } from "../App";
import moment from "moment";
import { PacmanLoader } from "react-spinners";
import { Recipe } from "../types";
import { IoFilter, IoSearch } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";


export interface Ingredient {
  quantity: number;
  unit: string;
  description?: string;
}

export interface Nutrition {
  calories: number;
  macronutrients: { [key: string]: Macronutrient };
}

export interface Macronutrient {
  amount: number;
  unit: string;
  percentage: number;
}

interface RecipesPageProps {
  mealPlan: MealPlan[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan[]>>;
}

const RecipesPage: React.FC<RecipesPageProps> = ({ mealPlan }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [breakfastMealPlan, setBreakfastMealPlan] = useState<MealPlan[]>([]);
  const [lunchMealPlan, setLunchMealPlan] = useState<MealPlan[]>([]);
  const [dinnerMealPlan, setDinnerMealPlan] = useState<MealPlan[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mealType, setMealType] = useState<string>("breakfast");
  const [message, setMessage] = useState<string>("");

  const { user, session, setIsLoading, isLoading } = useAuth();

  useEffect(() => {
    setIsLoading(true);

    fetchAllRecipes()
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    // Get the start and end of the current week
    const weekStartDate = moment()
      .startOf("week")
      .startOf("day")
      .format("YYYY-MM-DD");
    const weekEndDate = moment()
      .endOf("week")
      .startOf("day")
      .format("YYYY-MM-DD");

    // Filter meals based on the week
    const currentWeekMealPlan = mealPlan.filter((meal) => {
      const date = moment(meal.start).format("YYYY-MM-DD");
      return date >= weekStartDate && date <= weekEndDate;
    });

    // Initialize the arrays
    const breakfast = new Array(7).fill(null);
    const lunch = new Array(7).fill(null);
    const dinner = new Array(7).fill(null);

    // Loop through the meals and place them in the right index based on the day of the week
    currentWeekMealPlan.forEach((meal) => {
      const mealDate = moment(meal.start);
      const dayOfWeek = mealDate.day();

      // Assign the meal to the appropriate array
      if (meal.start.getHours() === 0) {
        breakfast[dayOfWeek] = meal;
      } else if (meal.start.getHours() === 8) {
        lunch[dayOfWeek] = meal;
      } else if (meal.start.getHours() === 16) {
        dinner[dayOfWeek] = meal;
      }
    });

    // Set the state for each meal type
    setBreakfastMealPlan(breakfast);
    setLunchMealPlan(lunch);
    setDinnerMealPlan(dinner);
  }, [mealPlan]);

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    if (!e.over || !e.active) return;

    const recipe = e.active.data?.current?.recipe;
    const overId = parseInt(e.over.id.toString(), 10);

    if (!overId || !recipe) return;

    const updatedDroppedRecipes = [...droppedRecipes];
    updatedDroppedRecipes[overId] = recipe;

    if (session && user) {
      // Check if there's a recipe in the day slot for the selected meal type
      const checkRecipeInSlot = () => {
        switch (mealType) {
          case "lunch":
            return lunchMealPlan[overId] || droppedRecipes[overId];
          case "dinner":
            return dinnerMealPlan[overId] || droppedRecipes[overId];
          default:
            return breakfastMealPlan[overId] || droppedRecipes[overId];
        }
      };

      const currentDate = moment();
      const date = currentDate
        .startOf("week")
        .add(overId, "days")
        .format("YYYY-MM-DD");

      // Prevent adding recipes to past days
      if (overId < moment().day()) {
        showMessage("Cannot add meal plan to past days");
        return;
      }

      // Update meal plan if recipe already exists in slot
      if (checkRecipeInSlot()) {
        const updatedMeal = await updateMealPlanByDateAndMealType(
          user.id,
          session.access_token,
          recipe,
          date,
          mealType
        );
        if (updatedMeal) {
          showMessage("Meal plan updated successfully");
          setDroppedRecipes(updatedDroppedRecipes);
        }
        return;
      }

      // Add new recipe if no recipe is already in the slot
      if (!droppedRecipes[overId]) {
        const newMeal = await addRecipeToMealPlan(
          user.id,
          session.access_token,
          recipe,
          date,
          mealType
        );
        if (newMeal) {
          showMessage("Recipe added to meal plan successfully");
          setDroppedRecipes(updatedDroppedRecipes);
        }
      }
    }
  };

  return (
    <>
      {/* Recipe Cards Section */}
      <div
        className="flex flex-col justify-center"
      >
        {isLoading ? (
          <PacmanLoader />
        ) : (
          <>
            <div className="flex p-5 h-vh">
              <div className="flex-1 relative">
                <IoSearch size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500" />
                <input 
                  className="pl-12 text-2xl shadow appearance-none rounded-lg text-gray-700 focus:outline-none p-2 bg-[#e5e7e9]"
                  placeholder="Search for recipes" 
                />
              </div>
              <button className="px-2">
                <IoFilter size={30} className=" text-neutral-700"/>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-5 px-5 overflow-auto justify-items-center">
              {recipes &&
                recipes.length > 0 &&
                recipes.map((recipe, index) => (
                  <div
                    key={index}
                    onClick={() => openModal(recipe)}
                    className="flex items-center w-full gap-5"
                  >
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      
      {selectedRecipe && <RecipeModal isOpen={isModalOpen} onClose={closeModal} selectedRecipe={selectedRecipe} /> }
    </>
  );
};

export default RecipesPage;
