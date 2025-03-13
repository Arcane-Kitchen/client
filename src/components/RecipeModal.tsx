import { useState} from "react";
import { Recipe } from "../types";
import { IoChevronBackCircle } from "react-icons/io5";
import { FaCircleXmark } from "react-icons/fa6";
import moment from "moment";


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRecipe: Recipe;
}

const RecipeModal: React.FC<ModalProps> = ({ isOpen, onClose, selectedRecipe }) => {

  const daysOfTheWeek = ["S", "M", "T", "W", "TH", "F", "S"];
  const mealTypes = ["Breakfast", "Lunch", "Dinner"];
  const [selectedDay, setSelectedDay] = useState<number>(moment().day());
  const [selectedMealType, setSelectedMealType] = useState<string>("");

  const handleDayClick = (index: number) => {
    console.log(selectedRecipe)
    setSelectedDay(index);
  }

  const handleMealTypeClick = (type: string) => {
    setSelectedMealType(type);
  }

  if (!isOpen) return null;

  return (
<<<<<<< HEAD
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-white rounded-lg p-8 w-3/4 max-w-2xl relative"
        style={{
          backgroundImage: `url(/paper-box.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
=======
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 w-vh h-vh lg:flex lg:justify-center lg:items-center"> 
      <div className="bg-[url('/paper-box.png')] bg-cover bg-center h-full w-full relative lg:rounded-lg lg:h-2/3 lg:w-1/2 lg:p-5 "> 

        {/* Close button */}
>>>>>>> c365eaa (feat: redesign recipe modal UI and implement mobile responsiveness)
        <button
            className="absolute top-2 left-2 hover:cursor-pointer lg:left-auto lg:right-2"
            onClick={onClose}
          >
            <IoChevronBackCircle size={40} className="text-[#19243e] hover:text-slate-600 lg:hidden"/>
            <FaCircleXmark size={40} className="text-[#19243e] hover:text-slate-600 hidden lg:block"/>
          </button>

        <div className="overflow-auto h-[88vh] lg:flex lg:flex-col lg:h-3/4 lg:w-auto">

          <div className="p-5 lg:flex-1 lg:flex">
            {selectedRecipe.image && 
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.name}
                className="mb-4 lg:w-1/3 lg:object-cover lg:mb-0"
              />
            }
            <div className="px-5">
              <h2 className="text-3xl font-bold">{selectedRecipe.name}</h2>

              {/* Nutritional Information Section */}
              <div className="flex gap-2 mb-4">
                <div className="flex flex-col items-center text-xs lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Calories: </span>{`${selectedRecipe.nutrition.calories} kcal`}</p>
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Fat: </span>{`${selectedRecipe.nutrition.macronutrients.fat.amount} g`}</p>
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Carbs: </span>{`${selectedRecipe.nutrition.macronutrients.carbs.amount} g`}</p>
                </div>
                <div className="flex flex-col items-center border-l-1 border-gray-400 text-xs pl-2 lg:text-sm">
                  <p className="font-bold"><span className="font-bold">Protein: </span>{`${selectedRecipe.nutrition.macronutrients.protein.amount} g`}</p>
                </div>
              </div>

              {/* Ingredients Section */}
              <h3 className="text-xl font-bold mb-2">Ingredients:</h3>
              <ul className="list-disc list-inside mb-4 pl-4">
                {Object.entries(selectedRecipe.ingredients).map(
                  ([key, ingredient], index) => (
                    <li key={index}>
                      {ingredient.quantity} {ingredient.unit} {key}{" "}
                      {ingredient.description &&
                        `- ${ingredient.description}`}
                    </li>
                  )
                )}
              </ul>
              
            </div>
          </div>

          {/* Instructions Section */}
          <div className="px-5 lg:flex-1">
            <h3 className="text-xl font-bold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside mb-4 pl-4">
              {selectedRecipe.instructions.map((instruction, index) => (
                <li key={`instructions-${index}`} >
                {instruction}
                </li>
              ))}
            </ol>
          </div> 
        </div>
        
        {/* Add meal plan functionality */}
        <div className="absolute bottom-0 left-0 w-full flex gap-2 border-t-2 border-gray-400 p-4 lg:h-1/4 lg:justify-center lg:items-center">
          <div className="flex-1 flex flex-col gap-2 lg:items-center lg:flex-0">
            <div className="flex-1 flex gap-2 items-center justify-around">
              {daysOfTheWeek.map((day, index) => (
                <button 
                  key={`${index}-${day}`} 
                  className={`hover:cursor-pointer text-white rounded-full size-8 lg:size-12 ${selectedDay === index ? "bg-[#19243e]": "bg-gray-400"}`}
                  onClick={() => handleDayClick(index)}
                >
                  {day}
                </button>
              ))}
            </div>
            <div className="flex-1 flex gap-2 lg:w-full">
              {mealTypes.map((type) => (
                <button 
                  key={type} 
                  className={`flex-1 hover:cursor-pointer text-white lg:py-2 ${selectedMealType === type ? "bg-[#19243e]": "bg-gray-400"}`}
                  onClick={() => handleMealTypeClick(type)}
                >
                {type}
              </button>
              ))}
            </div>
          </div>
          <button className="bg-[url('/button-box.svg')] bg-cover bg-center h-20 w-30 hover:cursor-pointer">
            <h1 className="text-white">Add</h1>
          </button>
        </div>
        
      </div>
    </div>
  );
};

export default RecipeModal;
