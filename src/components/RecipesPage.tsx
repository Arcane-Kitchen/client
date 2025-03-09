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
        </div>
        <MiniCalender droppedRecipes={droppedRecipes}/>
      </div>
    </DndContext>
  );
};

export default RecipesPage;
