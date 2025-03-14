import { useState } from "react";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import { updateMealPlanById } from "../api/mealPlanApi";
import { useAuth } from "../Auth/AuthContext";
import { PacmanLoader } from "react-spinners";
import { MealPlan } from "../App";
import { FaCheckCircle } from "react-icons/fa";


interface CalendarPageProps {
  mealPlan: MealPlan[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan[]>>;
}

const CalendarPage: React.FC<CalendarPageProps> = ({ mealPlan, setMealPlan }) => {
  const { user, session, isLoading } = useAuth();
  const [currentStartOfWeek, setCurrentStartOfWeek] = useState<moment.Moment>(moment().startOf("week"));

  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    let day = currentStartOfWeek.clone().add(i, "days");
    daysOfWeek.push(day.format("ddd DD"));
  }
  
  const handleCheckboxChange = async (mealId: string) => {
    const updatedMealPlan = mealPlan.map((meal) => {
      return meal.id === mealId
        ? { ...meal, hasBeenEaten: !meal.hasBeenEaten }
        : meal;
    });

    if (user && session) {
      try {
        const mealToUpdate = updatedMealPlan.find((meal) => meal.id === mealId);
        if (mealToUpdate) {
          await updateMealPlanById(user.id, mealId, session.access_token, {
            has_been_eaten: mealToUpdate.hasBeenEaten,
          });
        }
        setMealPlan(updatedMealPlan);
      } catch (error: any) {
        console.error("Error updating meal plan:", error);
      }
    }
  };

  return (
    <div className="h-fit flex flex-col items-center justify-center p-10 ">
      <div className="flex-1 bg-[url('/paper-box.jpg')] bg-cover bg-center w-full p-5">
        {isLoading ? (
          <PacmanLoader />
        ) : (
          <div className="flex flex-col">

            <h3 className="text-2xl mb-2">{`${currentStartOfWeek.format("MMMM DD")} - ${currentStartOfWeek.clone().add(6, "days").format("DD")}`}</h3>

            <div className="flex items-center border-1 border-gray-300 divide-x-1 divide-gray-300 mb-5 w-3/4 rounded-md">
              <button 
                className={`flex-1 py-1 rounded-tl-md rounded-bl-md ${currentStartOfWeek.isSame(moment().startOf("week")) ? "bg-[#19243e] text-[#ebd6aa]" : "hover:scale-105 hover:cursor-pointer hover:bg-[#19243e] hover:text-[#ebd6aa] hover:shadow-lg"}`}
                onClick={() => setCurrentStartOfWeek(moment().startOf("week"))}
              >
                Today
              </button>
              <button 
                className="flex-1 py-1 hover:cursor-pointer hover:bg-[#19243e] hover:text-[#ebd6aa] hover:scale-105 hover:shadow-lg"
                onClick={() => setCurrentStartOfWeek(currentStartOfWeek.clone().subtract(7, "days").startOf("week"))}
              >
                Back
              </button>
              <button 
                className="flex-1 py-1 rounded-tr-md rounded-br-md hover:cursor-pointer hover:bg-[#19243e] hover:text-[#ebd6aa] hover:scale-105 hover:shadow-lg"
                onClick={() => setCurrentStartOfWeek(currentStartOfWeek.clone().add(7, "days").startOf("week"))}
              >
                Next
              </button>
            </div>

            <div className="flex w-full">
              <div className="w-1/4 bg-[#19243e]"></div>
              {["Breakfast", "Lunch", "Dinner"].map((type) => (
                <div key={type} className="w-1/4 bg-[#19243e] text-[#ebd6aa] text-center">{type}</div>
              ))}
            </div>
            
            {/* Rows for each day of the week */}
            {daysOfWeek.map((day, index) => {
              return (
                <div className="flex w-full border-b-1 border-l-1 border-gray-300">
                  {/* Day header */}
                  <div key={day} className="w-1/4 flex items-center p-2 border-r-1 border-gray-300">
                    <p className="flex-1">{day}</p>
                  </div>

                  {["breakfast", "lunch", "dinner"].map((type) => {
                    const weeklyMeals = mealPlan.filter((meal) => {
                      return meal.date === currentStartOfWeek.clone().add(index, "days").format("M/DD/YYYY") && meal.mealType.toLowerCase() === type;
                    })
                    
                    if (weeklyMeals.length === 0) {
                      return (
                        <div key={`${day}-${type}`} className="border-r-1 border-gray-300 w-1/4 h-20"></div>
                      );
                    }

                    return weeklyMeals.map((meal) => (
                      <div className="border-r-1 border-gray-300 w-1/4 h-20 p-1 relative">
                        <div key={meal.id} className="w-full  h-full text-center bg-cover bg-center hover:cursor-pointer" style={{ backgroundImage: `url(${meal.imageUrl})` }}></div>
                        {meal.hasBeenEaten && <FaCheckCircle color="green" className="absolute bottom-0.5 right-0.5"/>}
                      </div>
                    ))
                  })
                  }
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
