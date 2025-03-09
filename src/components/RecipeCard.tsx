import React from 'react'
import { recipe } from './RecipesPage'

interface RecipeCardProps {
    recipe: recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="w-full h-full bg-[url('./assets/old-style-paper.png')] bg-cover bg-center px-15 py-5 flex">
        <div className="flex flex-col gap-3">
            <h1>{recipe.name}</h1>
            <p>{recipe.description}</p>
        </div>
        <div>
            <img src={recipe.image} />
        </div>  
    </div>
  )
}

export default RecipeCard
