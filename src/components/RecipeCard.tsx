import { Recipe } from "../types";
import { IoIosTimer } from "react-icons/io";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {


  return (
    <div
      className="w-full h-full bg-[url('/paper-box.jpg')] bg-cover bg-center hover:cursor-pointer border-black border-solid border-1"
    >
      <div className="w-full p-2">
        {recipe.image &&
          <img
            className="object-cover w-full mb-2"
            src={recipe.image}
            alt={recipe.name}
          />
        }
        <h1 className="font-bold text-xl">{recipe.name}</h1>
        <div className="flex gap-2 mb-2">
          <div className="flex gap-0.5 items-center">
            <img src="/level-icon.png" className="size-2.5" />
            <p className="text-[10px] mb-0">{recipe.difficulty.charAt(0) + recipe.difficulty.slice(1).toLowerCase()}</p>
          </div>
          <p className="text-[10px] flex items-center"><IoIosTimer />{recipe.prep_time} minutes</p>
          <div className="flex gap-0.5 items-baseline text-black">
            <img src="/calories-icon.png" className="size-2.5" />
            <p className="text-[10px]">{recipe.nutrition.calories}</p>
          </div>
        </div>
        <p className="text-sm/5 mb-2">{recipe.description}</p>
      </div>
    </div>
  );
};

export default RecipeCard;
