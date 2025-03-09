import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { fetchAllRecipes } from "../api/recipeApi";
import MiniCalender from "./MiniCalender";
import RecipeCard from "./RecipeCard";

export interface recipe {
  id: string,
  name: string,
  description: string,
  image: string,
}

const RecipesPage: React.FC = () => {

  const [recipes, setRecipes] = useState<recipe[]>([]);

  useEffect(() => {
    fetchAllRecipes()
      .then((data) => setRecipes(data))
      .catch((error) => console.error(error))
  }, [])

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center pt-16">
      <Navbar />
      <h1 className="text-3xl font-bold underline text-white mb-8 mt-3">
        Available Recipes
      </h1>
      <div className="grid grid-cols-1 w-3/4 gap-10 mb-10">
        {recipes && recipes.length > 0 &&
          recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe}/>
          ))
        }
        <MiniCalender recipes={recipes}/>
      </div>
    </div>
  );
};

export default RecipesPage;
