import React, { CSSProperties, useEffect, useState } from "react";
import "react-calendar/dist/Calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchFullUserMealPlan } from "../api/mealPlanApi";
import { useAuth } from "../Auth/AuthContext";

const localizer = momentLocalizer(moment);

interface Meal {
  recipe_id: string;
  day_to_eat: string;
  chosen_meal_type: string;
  servings: number;
  exp: number;
  has_been_eaten: boolean;
}

interface TimeSlotWrapperProps {
  value: Date;
  children: React.ReactNode;
}

const TimeSlotWrapper: React.FC<TimeSlotWrapperProps> = ({ value, children }) => {
  const hour = value.getHours();
  let label = '';

  // Map the hour to a meal label
  if (hour === 0) {
    label = "Breakfast";
  } else if (hour === 8) {
    label = "Lunch";
  } else if (hour === 16) {
    label = "Dinner";
  }

   const style: CSSProperties = {
    padding: '5px',
    textAlign: 'center',
  };

  return <div style={style}>{label || children}</div>;
};

const CalendarPage: React.FC = () => {
  const [mealPlan, setMealPlan] = useState([]);
  const { user, session } = useAuth();

  useEffect(() => {
    if (user && session) {
      fetchFullUserMealPlan(user.id, session.access_token)
        .then((data) => {
          return data.map((meal: Meal) => {
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

            return {
              id: meal.recipe_id,
              title: meal.recipe_id,
              start,
              end,

            }
          })
        })
        .then((data) => setMealPlan(data))
        .catch((error) => console.error(error));
    }
  }, [])

  useEffect(() => {
    console.log(mealPlan)
  }, [mealPlan])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('./assets/paper-box.png')] bg-cover bg-center w-5/6 h-[70vh] p-10 flex items-center">
          <Calendar
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
            }}
          />
      </div>
    </div>
  );
};

export default CalendarPage;
