import React, { useState } from "react";
import Navbar from "./Navbar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import wizard from "../assets/wizard.jpg";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const CalendarPage: React.FC = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center pt-16">
      <Navbar />
      <div className="bg-[url('./assets/paper-box.png')] w-full h-full flex items-center flex-col">
        <Calendar className={"mt-15 mb-3"} onChange={onChange} value={value} />
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
