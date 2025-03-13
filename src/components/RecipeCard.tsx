import { Recipe } from "../types";
import { IoIosTimer } from "react-icons/io";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {


  return (
    <div
      className="w-full h-full bg-[url('/paper-box.jpg')] bg-cover bg-center hover:cursor-pointer"
    >
      <div className="w-full p-2 gap-2 flex flex-col lg:flex-row-reverse">
        {recipe.image &&
          <img
            className="object-cover w-full lg:mb-0 lg:w-1/3"
            src={recipe.image}
            alt={recipe.name}
          />
        }
        <div className="lg:px-2">
          <h1 className="font-bold text-xl lg:mb-2 lg:text-3xl">{recipe.name}</h1>
          <div className="flex gap-2 mb-2">
            <div className="flex gap-0.5 items-center">
              <img src="/level-icon.png" className="size-2.5 lg:size-3" />
              <p className="text-[10px] mb-0 lg:text-sm">{recipe.difficulty.charAt(0) + recipe.difficulty.slice(1).toLowerCase()}</p>
            </div>
            <p className="text-[10px] flex items-center lg:text-sm"><IoIosTimer />{recipe.prep_time} minutes</p>
            <div className="flex gap-0.5 items-baseline text-black">
              <img src="/calories-icon.png" className="size-2.5 lg:size-3" />
              <p className="text-[10px] lg:text-sm">{recipe.nutrition.calories}</p>
            </div>
          </div>
          <p className="text-sm/5 mb-2 lg:text-base/5">{recipe.description}</p>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
