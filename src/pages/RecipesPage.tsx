import React, { useEffect, useState } from "react";
import { fetchAllRecipes } from "../api/recipeApi";
import MiniCalender from "../components/MiniCalender";
import RecipeCard from "../components/RecipeCard";
import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import RecipeModal from "../components/RecipeModal";
import { addRecipeToMealPlan, updateMealPlanByDateAndMealType } from "../api/mealPlanApi"
import { useAuth } from "../Auth/AuthContext";
import { MealPlan } from "../App";
import moment from "moment";

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

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: string;
  prep_time: number;
  instructions: string;
  nutrition: Nutrition;
  meal_type: string[];
  ingredients: { [key: string]: Ingredient };
}

interface RecipesPageProps {
  mealPlan: MealPlan[],
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan[]>>
}

const RecipesPage: React.FC<RecipesPageProps> = ({ mealPlan }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [breakfastMealPlan, setBreakfastMealPlan] = useState<MealPlan[]>([])
  const [lunchMealPlan, setLunchMealPlan] = useState<MealPlan[]>([])
  const [dinnerMealPlan, setDinnerMealPlan] = useState<MealPlan[]>([])
  const [droppedRecipes, setDroppedRecipes] = useState<Recipe[]>(
    new Array(7).fill(null)
  );
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [mealType, setMealType] = useState<string>("breakfast");

  useEffect(() => {
    fetchAllRecipes()
      .then((data) => setRecipes(data))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    // Get the start and end of the current week
    const weekStartDate = moment().startOf("week").startOf("day").format("YYYY-MM-DD");
    const weekEndDate = moment().endOf("week").startOf("day").format("YYYY-MM-DD");

    // Filter meals based on the week
    const currentWeekMealPlan = mealPlan.filter(meal => {
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
  }, [mealPlan])

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  const { user, session } = useAuth();

  const handleDragEnd = async (e:DragEndEvent) => {
    if (e.over && e.active) {
      const recipe = e.active.data?.current?.recipe;
      const overId = parseInt(e.over.id.toString(), 10);

      if (overId && recipe) {
        const updatedDroppedRecipes = [...droppedRecipes];
        updatedDroppedRecipes[overId] = recipe;
        setDroppedRecipes(updatedDroppedRecipes);

        if (session && user) {
          const checkRecipeInSlot = () => {
            switch (mealType) {
              case "lunch":
                  return lunchMealPlan[overId];
              case "dinner":
                  return dinnerMealPlan[overId];
              default:
                  return breakfastMealPlan[overId]; 
            }
          }

          const currentDate = moment();
          const date = currentDate.startOf("week").add(overId, "days").format("YYYY-MM-DD");

          if (checkRecipeInSlot()) {
            updateMealPlanByDateAndMealType(user.id, session.access_token, recipe, date, mealType)
            return;
          }

          await addRecipeToMealPlan(user.id, session.access_token, recipe, date, mealType);
        }
      }
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  const sensors = useSensors(mouseSensor)

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>    
      {/* Recipe Cards Section */}
      <div
        className="flex flex-col items-center justify-center"
        style={{ height: "82vh" }}
      >
        <h1 className="text-3xl font-bold underline text-white mb-8 mt-3">
          Available Recipes
        </h1>

        <div className="grid grid-cols-1 gap-10 overflow-auto justify-items-center">
          {recipes &&
            recipes.length > 0 &&
            recipes.map((recipe, index) => (
              <div
                key={index}
                onClick={() => openModal(recipe)}
                className="flex items-center w-3/4 gap-5"
              >
                <RecipeCard recipe={recipe} />
                <button className="bg-[url('./assets/button-box.svg')] bg-cover bg-center h-30 w-45 hover:cursor-pointer">
                  <h1 className="text-white">Add</h1>
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* Mini Calendar Section */}
      <div className="fixed bottom-0 left-0 w-full">
        <MiniCalender 
          droppedRecipes={droppedRecipes}
          mealType={mealType}
          setMealType={setMealType} 
          breakfastMealPlan={breakfastMealPlan} 
          lunchMealPlan={lunchMealPlan}
          dinnerMealPlan={dinnerMealPlan}
        />
      </div>

      <RecipeModal isOpen={isModalOpen} onClose={closeModal}>
        {selectedRecipe && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedRecipe.name}</h2>
            <div className="flex flex-row gap-4">
              <div className="w-1/2">
                <h3 className="text-xl font-bold mb-2">Ingredients:</h3>
                <ul className="list-disc list-inside mb-4">
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
                <h3>
                  <span className="font-bold">Prep Time:</span>{" "}
                  {selectedRecipe.prep_time} minutes
                </h3>
              </div>
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="w-1/2 mb-4"
              />
            </div>
            <h3 className="text-xl font-bold mb-2">Instructions:</h3>
            <p>{selectedRecipe.instructions}</p>
          </div>
        )}
      </RecipeModal>
    </DndContext>
  );
};

export default RecipesPage;
