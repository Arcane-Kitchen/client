import React, { useEffect, useState } from "react";
import { fetchAllRecipes } from "../api/recipeApi";
import MiniCalender from "./MiniCalender";
import RecipeCard from "./RecipeCard";
import { DndContext, DragEndEvent, MouseSensor, useSensor, useSensors } from "@dnd-kit/core";
import RecipeModal from "./RecipeModal";
import { addRecipeToMealPlan } from "../api/mealPlanApi"

export interface Ingredient {
  quantity: number;
  unit: string;
  description?: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  instructions: string;
  meal_type: string[];
  ingredients: { [key: string]: Ingredient };
}

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [droppedRecipes, setDroppedRecipes] = useState<Recipe[]>(new Array(7).fill(null));
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchAllRecipes()
      .then((data) => setRecipes(data))
      .catch((error) => console.error(error));
  }, []);

  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  const handleDragEnd = async (e:DragEndEvent) => {
    if (e.over && e.active) {

      const recipe = e.active.data?.current?.recipe;
      const overId = parseInt(e.over.id.toString(), 10);

      if (overId && recipe) {
        const updatedDroppedRecipes = [...droppedRecipes];
        updatedDroppedRecipes[overId] = recipe;
        setDroppedRecipes(updatedDroppedRecipes);

        await addRecipeToMealPlan;
      }
    }
  }

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
        <div className="flex flex-col items-center justify-center" style={{ height: "80vh" }}>
          <h1 className="text-3xl font-bold underline text-white mb-8 mt-3">
            Available Recipes
          </h1>

          <div className="grid grid-cols-1 gap-10 overflow-auto justify-items-center">
            {recipes && recipes.length > 0 &&
              recipes.map((recipe, index) => (
                <div 
                  key={index}
                  onClick={() => openModal(recipe)}
                  className="flex items-center w-3/4"
                 >
                  <RecipeCard recipe={recipe}/>
                  <button className="bg-[url('./assets/button-box.svg')] bg-cover bg-center h-25 w-45 hover:cursor-pointer">
                    <h1 className="text-white">Add</h1>
                  </button>
                </div>
              ))
            }
          </div>

        </div>

        {/* Mini Calendar Section */}
        <div className="fixed bottom-0 left-0 w-full">
          <MiniCalender droppedRecipes={droppedRecipes}/>
        </div>
      
        <RecipeModal isOpen={isModalOpen} onClose={closeModal}>
          {selectedRecipe && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{selectedRecipe.name}</h2>
              <div className="flex flex-row gap-4">
                <div className="w-1/2">
                  <h3 className="text-xl font-bold mb-2">Ingredients:</h3>
                  <ul className="list-disc list-inside mb-4">
                    {Object.entries(selectedRecipe.ingredients).map(([key, ingredient], index) => (
                      <li key={index}>
                        {ingredient.quantity} {ingredient.unit} {key} {ingredient.description && `- ${ingredient.description}`}
                      </li>
                    ))}
                  </ul>
                </div>
                <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-1/2 mb-4" />
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
