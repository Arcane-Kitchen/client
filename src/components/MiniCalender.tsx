import { Recipe } from './RecipesPage'
import DaySlot from './DaySlot'

interface MiniCalenderProps {
    droppedRecipes: Recipe[];
}

const MiniCalender:React.FC<MiniCalenderProps> = ({ droppedRecipes }) => {

    const daysOfTheWeek = ["SU", "M", "T", "W", "TH", "F", "S"];

    return (
        <div>
            <div className="grid grid-cols-7 gap-2 h-30">
            {daysOfTheWeek.map((day, index) => (
                <DaySlot key={index} id={index.toString()} day={day} recipe={droppedRecipes[index] || null}/>
            ))}
            </div>
        </div>
    )
}

export default MiniCalender
