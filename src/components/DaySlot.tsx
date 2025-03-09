import React from "react"
import {useDroppable} from "@dnd-kit/core";
import { recipe } from "./RecipesPage";

interface DaySlotProps {
    id: number,
    day: string;
    recipes: recipe[];
}

const DaySlot:React.FC<DaySlotProps> = ({ id, day, recipes }) => {
    const {setNodeRef} = useDroppable({
        id,
    });

    return (
        <div ref={setNodeRef} className="bg-orange-100 text-center size-full">
            <h1>{day}</h1>
        </div>
    )
}

export default DaySlot
