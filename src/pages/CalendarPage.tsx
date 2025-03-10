import React, { CSSProperties, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchFullUserMealPlan, updateMealPlan } from "../api/mealPlanApi";
import { useAuth } from "../Auth/AuthContext";
import { fetchARecipeById } from "../api/recipeApi"
import { PacmanLoader } from "react-spinners";

const localizer = momentLocalizer(moment);

export interface MealPlan {
  id: string,
  recipe_id: string;
  day_to_eat: string;
  chosen_meal_type: string;
  servings: number;
  exp: number;
  has_been_eaten: boolean;
}

interface Meal {
  id: string;
  title: string;
  start: Date;
  end: Date;
  imageUrl: string,
  hasBeenEaten: boolean;
}

interface TimeSlotWrapperProps {
  value: Date;
  children: React.ReactNode;
}

const TimeSlotWrapper: React.FC<TimeSlotWrapperProps> = ({ value, children }) => {
  const hour = value.getHours();
  let label = "";

  // Map the hour to a meal label
  if (hour === 0) {
    label = "Breakfast";
  } else if (hour === 8) {
    label = "Lunch";
  } else if (hour === 16) {
    label = "Dinner";
  }

   const style: CSSProperties = {
    padding: "5px",
    textAlign: "center",
  };

  return <div style={style}>{label || children}</div>;
};

const CalendarPage: React.FC = () => {
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const { user, session, isLoading, setIsLoading } = useAuth();

  useEffect(() => {
    if (user && session) {
      setIsLoading(true);
      const fetchUserMealData = async () => {
        try {
          const mealPlan = await fetchFullUserMealPlan(user.id, session.access_token);
          const mappedMealPlan = await Promise.all(mealPlan.map(async (meal: MealPlan) => {
            let start = new Date(meal.day_to_eat);
  
            if (meal.chosen_meal_type === "breakfast") {
              start.setHours(0, 0, 0);
            } else if (meal.chosen_meal_type === "lunch") {
              start.setHours(8, 0, 0);
            } else {
              start.setHours(16, 0, 0);
            }
  
            let end = new Date(start);
            end.setHours(start.getHours() + 7);
  
            let recipe = await fetchARecipeById(meal.recipe_id)
  
            return {
              id: meal.id,
              title: meal.recipe_id,
              start,
              end,
              imageUrl: recipe.image,
              hasBeenEaten: meal.has_been_eaten,
            }
          }))
          setMealPlan(mappedMealPlan);
        } catch (error:any) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchUserMealData();
    }
  }, [session])

  const handleCheckboxChange = async (mealId: string) => {
    const updatedMealPlan = mealPlan.map((meal) => {
      return meal.id === mealId ? { ...meal, hasBeenEaten: !meal.hasBeenEaten } : meal
    })
    
    if (user && session) {
      try {
        const mealToUpdate = updatedMealPlan.find((meal) => meal.id === mealId);
        if (mealToUpdate) {
          await updateMealPlan(user.id, mealId, session.access_token, { has_been_eaten : mealToUpdate.hasBeenEaten })
        }
        setMealPlan(updatedMealPlan);
      } catch (error: any) {
        console.error("Error updating meal plan:", error);
      }
    }
  };

  const CustomEvent:React.FC<{ mealPlan: Meal}> = ({ mealPlan }) => {
    return (
    <div 
      className={`relative w-full h-full bg-cover bg-center`}
      style={{ backgroundImage: `url(${mealPlan.imageUrl})`}}
    >
      <input 
        type="checkbox"
        defaultChecked={mealPlan.hasBeenEaten}
        className="absolute top-0.5 right-0.5"
        style={{ background: 'transparent', border: 'none' }}
        onChange={() => handleCheckboxChange(mealPlan.id)}
      />
    </div>
    )
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('./assets/paper-box.png')] bg-cover bg-center w-5/6 h-[70vh] p-10 flex items-center justify-center">
        {isLoading ? 
          <PacmanLoader />
          : <Calendar
            className="flex-1"
            localizer={localizer}
            events={mealPlan}
            views={["week"]}
            defaultView="week"
            step={480}
            timeslots={1}
            style={{ height: 500 }}
            components={{
              timeSlotWrapper: TimeSlotWrapper as React.ComponentType<any>,
              event: ({ event }) => <CustomEvent mealPlan={event} />,
            }}
          />
        }
      </div>
    </div>
  );
};

export default CalendarPage;
