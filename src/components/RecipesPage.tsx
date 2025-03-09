import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { fetchAllRecipes } from "../api/recipeApi";
import RecipeModal from "./RecipeModal";

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
  ingredients: { [key: string]: Ingredient };
}

const RecipesPage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
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

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center pt-16">
      <Navbar />
      <h1 className="text-3xl font-bold underline text-white mb-8 mt-3">
        Available Recipes
      </h1>
      <div className="grid grid-cols-1 w-3/4 gap-10 mb-10">
        {recipes &&
          recipes.length > 0 &&
          recipes.map((recipe, index) => (
            <div
              key={index}
              className="w-full h-full bg-[url('./assets/old-style-paper.png')] bg-cover bg-center px-15 py-5 flex cursor-pointer"
              onClick={() => openModal(recipe)}
            >
              <div className="flex flex-col gap-3">
                <h1>{recipe.name}</h1>
                <p>{recipe.description}</p>
              </div>
              <div>
                <img src={recipe.image} alt={recipe.name} />
              </div>
            </div>
          ))}
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
    </div>
  );
};

export default RecipesPage;
