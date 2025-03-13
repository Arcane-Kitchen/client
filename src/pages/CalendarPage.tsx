import React, { CSSProperties } from "react";
import "react-calendar/dist/Calendar.css";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { updateMealPlanById } from "../api/mealPlanApi";
import { useAuth } from "../Auth/AuthContext";
import { PacmanLoader } from "react-spinners";
import { MealPlan } from "../App";
import "../theme.scss";

const localizer = momentLocalizer(moment);

interface TimeSlotWrapperProps {
  value: Date;
  children: React.ReactNode;
}

const TimeSlotWrapper: React.FC<TimeSlotWrapperProps> = ({
  value,
  children,
}) => {
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

interface CalendarPageProps {
  mealPlan: MealPlan[];
  setMealPlan: React.Dispatch<React.SetStateAction<MealPlan[]>>;
}

const CalendarPage: React.FC<CalendarPageProps> = ({
  mealPlan,
  setMealPlan,
}) => {
  const { user, session, isLoading } = useAuth();

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

  const CustomEvent: React.FC<{ mealPlan: MealPlan }> = ({ mealPlan }) => {
    return (
      <div
        className={`relative w-full h-full bg-cover bg-center`}
        style={{ backgroundImage: `url(${mealPlan.imageUrl})` }}
      >
        <input
          type="checkbox"
          defaultChecked={mealPlan.hasBeenEaten}
          className="absolute top-0.5 right-0.5"
          style={{ background: "transparent", border: "none" }}
          onChange={() => handleCheckboxChange(mealPlan.id)}
        />
      </div>
    );
  };

  const eventPropGetter = () => {
    return {
      style: {
        backgroundColor: "transparent",
        border: "none",
      },
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pb-16">
      <div className="bg-[url('/paper-box.jpg')] bg-cover bg-center w-5/6 h-[70vh] p-10 flex items-center justify-center">
        {isLoading ? (
          <PacmanLoader />
        ) : (
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
              event: ({ event }) => <CustomEvent mealPlan={event} />,
            }}
            eventPropGetter={eventPropGetter}
          />
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
