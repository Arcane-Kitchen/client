import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { fetchAllRecipes } from "../api/recipeApi";

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

  useEffect(() => {
    if (recipes.length > 0) {
      console.log(recipes);
    }
  },[recipes])

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center justify-center pt-16">
      <Navbar />
      <h1 className="text-3xl font-bold underline text-white mb-8 mt-3">
        Available Recipes
      </h1>
      <div className="grid grid-cols-1 w-3/4 gap-10 mb-10">
        {recipes && recipes.length > 0 &&
          recipes.map((recipe, index) => (
            <div
              key={index} 
              className="w-full h-full bg-[url('./assets/old-style-paper.png')] bg-cover bg-center px-15 py-5 flex"
            >
              <div className="flex flex-col gap-3">
                <h1>{recipe.name}</h1>
                <p>{recipe.description}</p>
              </div>
              <div>
                <img src={recipe.image} />
              </div>
            </div>
          ))
        }

      </div>
    </div>
  );
};

export default RecipesPage;
