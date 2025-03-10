import React, { CSSProperties, useEffect, useState } from "react";
import Navbar from "./Navbar";
import "react-calendar/dist/Calendar.css";
import wizard from "../assets/wizard.jpg";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { fetchFullUserMealPlan } from "../api/mealPlanApi";
import { useAuth } from "../Auth/AuthContext";

const localizer = momentLocalizer(moment);

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
        .then((data) => setMealPlan(data))
        .catch((error) => console.error(error));
    }
  }, [])

  useEffect(() => {
    console.log(mealPlan)
  }, [mealPlan])

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center pt-16">
      <Navbar />
      <div className="bg-[url('./assets/paper-box.png')] w-full h-full flex items-center flex-col">
          <Calendar
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
        <div className="flex justify-around w-full mb-6">
          <div>
            <h2 className="font-bold underline">Breakfast</h2>
            <img className="size-20" src={wizard} alt="" />
          </div>

          <div>
            <h2 className="font-bold underline">Lunch</h2>
            <img className="size-20" src={wizard} alt="" />
          </div>
          <div>
            <h2 className="font-bold underline">Dinner</h2>
            <img className="size-20" src={wizard} alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
