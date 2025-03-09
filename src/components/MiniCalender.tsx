import React from 'react'
import { recipe } from './RecipesPage'
import DaySlot from './DaySlot'

interface MiniCalenderProps {
    recipes: recipe[]
}


const MiniCalender:React.FC<MiniCalenderProps> = ({ recipes }) => {

    const daysOfTheWeek = ["S", "M", "T", "W", "TH", "F", "S"]
    return (
        <div className="grid grid-cols-7 gap-2">
        {daysOfTheWeek.map((day, index) => (
            <DaySlot key={index} id={index} day={day} recipes={recipes}/>
        ))}
        </div>
    )
}

export default MiniCalender
