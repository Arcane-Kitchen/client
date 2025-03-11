import { useState } from "react"
import { Recipe } from "../pages/RecipesPage"
import DaySlot from "./DaySlot"
import { MealPlan } from "../App"

interface MiniCalenderProps {
    droppedRecipes: Recipe[];
    mealType: string;
    setMealType: React.Dispatch<React.SetStateAction<string>>;
    breakfastMealPlan: MealPlan[];
    lunchMealPlan: MealPlan[];
    dinnerMealPlan: MealPlan[];
}

const MiniCalender:React.FC<MiniCalenderProps> = ({ droppedRecipes, mealType, setMealType, breakfastMealPlan, lunchMealPlan, dinnerMealPlan }) => {

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const daysOfTheWeek = ["S", "M", "T", "W", "TH", "F", "S"];

    const toggleCalendar = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className={`bg-[url('./assets/sign-up-box.svg')] bg-cover bg-top w-full px-20 flex flex-col gap-2 items-center ${isOpen ? 'aspect-4/1 py-5' : 'aspect-15/1'}`}>
            <button 
                className={`h-1/5 w-1/8 cursor-pointer text-blue-950 ${!isOpen && 'flex-1'}`}
                onClick={toggleCalendar}
            >. {/* <----- Period is not a typo */}
            </button>
            {isOpen && 
                <div className="flex-1 w-full flex flex-col items-center gap-2">
                    <label className="text-orange-100">
                        Meal Type:
                        <select name="selectedMealType" onChange={(e) => setMealType(e.target.value)}>
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                        </select>
                    </label>

                    <div className="grid grid-cols-7 gap-2 h-2/3 w-full flex-1">
                        {daysOfTheWeek.map((day, index) => (
                            <DaySlot 
                                key={index} 
                                id={index.toString()} 
                                day={day} 
                                recipe={droppedRecipes[index] || null}
                                meal={mealType === "breakfast" ? breakfastMealPlan[index] 
                                    : mealType === "lunch" ? lunchMealPlan[index] 
                                    : dinnerMealPlan[index]
                                }
                            />
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}

export default MiniCalender
