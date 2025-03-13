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
    <div className="flex flex-col h-dvh relative">
      {isLoading ? (
        <PacmanLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"/>
      ) : (
        <>
          {/* Search bar and filter section */}
          <div className="flex-1 flex p-5 lg:px-15 lg:w-full">
            <div className="flex-1 relative lg:flex-0">
              <IoSearch size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              <input 
                className="pl-12 text-xl shadow appearance-none rounded-lg text-gray-700 focus:outline-none p-2 bg-[#e5e7e9] lg:w-sm lg:text-2xl"
                placeholder="Search for recipes" 
              />
            </div>
            <button className="px-2">
              <IoFilter size={30} className=" text-neutral-700"/>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-5 px-5 pb-5 justify-items-center lg:grid-cols-3 lg:px-15">
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

      {selectedRecipe && <RecipeModal isOpen={isModalOpen} onClose={closeModal} selectedRecipe={selectedRecipe} /> }
    </div>
  );
};

export default RecipesPage;
