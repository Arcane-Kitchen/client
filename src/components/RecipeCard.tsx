import { Recipe } from "../types";
import { IoIosTimer } from "react-icons/io";
import { PiSneakerMoveFill, PiSwordFill } from "react-icons/pi";
import { FaShieldAlt } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa6";
import { MdEnergySavingsLeaf } from "react-icons/md";
import { handlePointCalc, handleRatioCalc } from "../util/statCalc";
import { useAuth } from "../Auth/AuthContext";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { user } = useAuth();

  const dietColors = {
    "Omnivore": "hidden",
    "Gluten free": "bg-blue-800",
    "Lactose free": "bg-purple-800",
    "Vegetarian": "bg-green-800",
    "Vegan": "bg-teal-800",
    "Nut free": "bg-yellow-800",
    "Keto": "bg-red-800",
  }

  return (
    <div className="w-full h-full bg-[url('/paper-box.jpg')] bg-cover bg-center hover:cursor-pointer">
      <div className="w-full p-2 gap-2 flex flex-col lg:flex-row-reverse">
        <div className="h-3/5 relative">
          {recipe.image ? (
            <img
              className="object-cover w-full lg:mb-0 lg:w-1/3"
              src={recipe.image}
              alt={recipe.name}
              loading="lazy"
            />
          ) : (
            <img className="object-cover w-full" src="/recipe_placeholder.png" />
          )}
          <p className={`absolute top-0 right-0 text-white px-2 ${dietColors[recipe.diet]}`}>{recipe.diet}</p>
        </div>
        <div className="lg:px-2">
          <h1 className="font-bold text-xl lg:mb-2 lg:text-3xl">
            {recipe.name}
          </h1>
          <div className="flex gap-2 mb-2">
            <div className="flex gap-0.5 items-center">
              <img src="/level-icon.png" className="size-2.5 lg:size-3" />
              <p className="text-[10px] mb-0 lg:text-sm">
                {recipe.difficulty === "INTERMEDIATE" ? "Moderate" : recipe.difficulty.charAt(0) +
                  recipe.difficulty.slice(1).toLowerCase()}
              </p>
            </div>
            <p className="text-[10px] flex items-center lg:text-sm">
              <IoIosTimer />
              {recipe.prep_time} min
            </p>
            <div className="flex gap-0.5 items-baseline text-black">
              <img src="/calories-icon.png" className="size-2.5 lg:size-3" />
              <p className="text-[10px] lg:text-sm">
                {recipe.nutrition.calories}
              </p>
            </div>
            {user && (
              <div className="flex items-center">
                <FaBookOpen className="text-xs" />
                <p className="text-xs">+20</p>
              </div>
            )}
          </div>
          <p className="text-sm/5 mb-2 lg:text-base/5">{recipe.description}</p>
          {user && (
            <div className="flex items-center">
              <PiSwordFill />
              <p>
                +
                {handlePointCalc(
                  handleRatioCalc(
                    user.daily_protein_goal,
                    recipe.nutrition.macronutrients.protein.percentage
                  ), false
                )}
              </p>
              <FaShieldAlt />
              <p>
                +
                {handlePointCalc(
                  handleRatioCalc(
                    user.daily_fat_goal,
                    recipe.nutrition.macronutrients.fat.percentage
                  ), false
                )}
              </p>
              <PiSneakerMoveFill />
              <p>
                +
                {handlePointCalc(
                  handleRatioCalc(
                    user.daily_carb_goal,
                    recipe.nutrition.macronutrients.carbs.percentage
                  ), false
                )}
              </p>
              <MdEnergySavingsLeaf />
              <p>
                +
                {handlePointCalc(
                  handleRatioCalc(
                    user.daily_calorie_goal / 3,
                    recipe.nutrition.calories
                  ), false
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
