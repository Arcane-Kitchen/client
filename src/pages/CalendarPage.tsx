import React, { CSSProperties, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchFullUserMealPlan } from "../api/mealPlanApi";
import { useAuth } from "../Auth/AuthContext";
import { fetchARecipeById } from "../api/recipeApi"
import { PacmanLoader } from "react-spinners";

const localizer = momentLocalizer(moment);

interface Meal {
  recipe_id: string;
  day_to_eat: string;
  chosen_meal_type: string;
  servings: number;
  exp: number;
  has_been_eaten: boolean;
}

interface MealPlan {
  id: string;
  title: string;
  start: Date;
  end: Date;
  imageUrl: string,
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
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const { user, session, isLoading, setIsLoading } = useAuth();

  useEffect(() => {
    if (user && session) {
      setIsLoading(true);
      const fetchUserMealData = async () => {
        try {
          const mealPlan = await fetchFullUserMealPlan(user.id, session.access_token);
          const mappedMealPlan = await Promise.all(mealPlan.map(async (meal: Meal) => {
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
              id: meal.recipe_id,
              title: recipe.name,
              start,
              end,
              imageUrl: recipe.image,
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

  const CustomEvent:React.FC<{ mealPlan: MealPlan}> = ({ mealPlan }) => {
    return <img src={mealPlan.imageUrl} alt={mealPlan.title} style={{ width: "100%", height: "auto" }} />
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
