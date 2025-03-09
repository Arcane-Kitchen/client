import React from "react"
import {useDroppable} from "@dnd-kit/core";
import { Recipe } from "./RecipesPage";

interface DaySlotProps {
    id: string,
    day: string;
    recipe: Recipe | null;
}

const DaySlot:React.FC<DaySlotProps> = ({ id, day, recipe }) => {
    const {setNodeRef} = useDroppable({
        id,
    });

    return (
        <div ref={setNodeRef} className="bg-orange-100 text-center size-full">
            {recipe? (
                <img src={recipe.image} />
            ) : (
                <h1>{day}</h1>
            )}
        </div>
    )
}

export default DaySlot
