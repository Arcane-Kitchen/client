import React from "react";
import { useAuth } from "../Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const CalendarPage: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("An error occurred: ", error);
    }
  };

  return (
    <div className="bg-[url('./assets/background.png')] bg-cover min-h-screen flex flex-col items-center pt-16">
      <Navbar />
      <h1 className="text-3xl font-bold underline text-black mb-8 mt-3">
        Calendar Page
      </h1>

      <div className="bg-[url('./assets/paper-box.png')] w-full h-full flex items-center flex-col">
        <h1 className="text-3xl">Week 1 March</h1>
        <table className="">
          <thead>
            <tr>
              <th scope="col" className="p-3"></th>
              <th scope="col" className="p-3">
                Breakfast
              </th>
              <th scope="col" className="p-3">
                Lunch
              </th>
              <th scope="col" className="p-3">
                Dinner
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" className="p-3">
                Monday
              </th>
              <td className="p-3">breakfast 1</td>
              <td className="p-3">lunch 1</td>
              <td className="p-3">dinner 1</td>
            </tr>
            <tr>
              <th scope="row" className="p-3">
                Tuesday
              </th>
              <td className="p-3">breakfast 2</td>
              <td className="p-3">lunch 2</td>
              <td className="p-3">dinner 2</td>
            </tr>
            <tr>
              <th scope="row" className="p-3">
                Wednesday
              </th>
              <td className="p-3">breakfast 3</td>
              <td className="p-3">lunch 3</td>
              <td className="p-3">dinner 3</td>
            </tr>
            <tr>
              <th scope="row" className="p-3">
                Thursday
              </th>
              <td className="p-3">breakfast 3</td>
              <td className="p-3">lunch 3</td>
              <td className="p-3">dinner 3</td>
            </tr>
            <tr>
              <th scope="row" className="p-3">
                Friday
              </th>
              <td className="p-3">breakfast 3</td>
              <td className="p-3">lunch 3</td>
              <td className="p-3">dinner 3</td>
            </tr>
            <tr>
              <th scope="row" className="p-3">
                Saturday
              </th>
              <td className="p-3">breakfast 3</td>
              <td className="p-3">lunch 3</td>
              <td className="p-3">dinner 3</td>
            </tr>
            <tr>
              <th scope="row" className="p-3">
                Sunday
              </th>
              <td className="p-3">breakfast 3</td>
              <td className="p-3">lunch 3</td>
              <td className="p-3">dinner 3</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default CalendarPage;
