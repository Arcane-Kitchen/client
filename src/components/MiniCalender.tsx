import React, { useState } from 'react'
import { recipe } from './RecipesPage'
import DaySlot from './DaySlot'

interface MiniCalenderProps {
    droppedRecipes: recipe[];
}

const MiniCalender:React.FC<MiniCalenderProps> = ({ droppedRecipes }) => {

    const daysOfTheWeek = ["SU", "M", "T", "W", "TH", "F", "S"];

    return (
        <div className="fixed bottom-0 left-0 w-full">
            <div className="grid grid-cols-7 gap-2">
            {daysOfTheWeek.map((day, index) => (
                <DaySlot key={index} id={index.toString()} day={day} recipe={droppedRecipes[index] || null}/>
            ))}
            </div>
        </div>
    )
}

export default MiniCalender
