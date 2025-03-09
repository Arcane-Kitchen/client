import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { fetchAllRecipes } from "../api/recipeApi";
import MiniCalender from "./MiniCalender";
import RecipeCard from "./RecipeCard";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

export interface recipe {
  id: string,
  name: string,
  description: string,
  image: string,
}

const RecipesPage: React.FC = () => {

  const [recipes, setRecipes] = useState<recipe[]>([]);
  const [droppedRecipes, setDroppedRecipes] = useState<recipe[]>(new Array(7).fill(null));

  useEffect(() => {
    fetchAllRecipes()
      .then((data) => setRecipes(data))
      .catch((error) => console.error(error))
  }, [])

  const handleDragEnd = (e:DragEndEvent) => {
    if (e.over && e.active) {

      const recipe = e.active.data?.current?.recipe;
      const overId = parseInt(e.over.id.toString(), 10);

      if (overId && recipe) {
        const updatedDroppedRecipes = [...droppedRecipes];
        updatedDroppedRecipes[overId] = recipe;
        setDroppedRecipes(updatedDroppedRecipes);
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>

        {/* Recipe Cards Section */}
        <div className="flex flex-col items-center justify-center" style={{ height: "80vh" }}>
          <h1 className="text-3xl font-bold underline text-white mb-8 mt-3">
            Available Recipes
          </h1>

          <div className="grid grid-cols-1 gap-10 overflow-auto justify-items-center">
            {recipes && recipes.length > 0 &&
              recipes.map((recipe, index) => (
                <div className="flex items-center w-3/4">
                  <RecipeCard key={index} recipe={recipe}/>
                  <button className="bg-[url('./assets/button-box.svg')] bg-cover bg-center h-20 w-40 hover:cursor-pointer">
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

    </DndContext>
  );
};

export default RecipesPage;
