import React from "react"
import {useDroppable} from "@dnd-kit/core";
import { Recipe } from "../pages/RecipesPage";
import { MealPlan } from "../App"

interface DaySlotProps {
    id: string,
    day: string;
    recipe: Recipe | null;
    meal: MealPlan
}

const DaySlot:React.FC<DaySlotProps> = ({ id, day, recipe, meal }) => {
    const {setNodeRef} = useDroppable({
        id,
    });

    return (
        <div ref={setNodeRef} className="bg-orange-100 flex items-center justify-center h-full overflow-hidden">
            {recipe? (
                <img src={recipe.image} className="w-full h-full object-cover" />
            ) : meal ? (
                <img src={meal.imageUrl} className="w-full h-full object-cover" />
            ) :
            (
                <h1>{day}</h1>
            )}
        </div>
    )
}

export default DaySlot
