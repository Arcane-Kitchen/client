import { Recipe } from "../pages/RecipesPage";
import { useDraggable } from "@dnd-kit/core";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: recipe.id,
      data: { recipe },
    });

  const style = {
    opacity: isDragging ? 0.5 : 1,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="w-3/4 h-full bg-[url('/paper-box.png')] bg-cover bg-center px-15 py-5 flex hover:cursor-grab border-black border-solid border-1"
    >
      <div className="flex flex-col gap-3 items-center p-1">
        <h1 className="font-bold underline">{recipe.name}</h1>
        <p>{recipe.description}</p>
        <p>
          <span className="font-bold">Type:</span> {recipe.meal_type}
        </p>
        <p>
          <span className="font-bold">Difficulty:</span> {recipe.difficulty}
        </p>
        <p>
          <span className="font-bold">Calories:</span>{" "}
          {recipe.nutrition.calories}
        </p>
        <ul>
          {Object.entries(recipe.nutrition.macronutrients).map(
            ([key, value]) => (
              <li>
                <span className="font-bold">{key}</span> &nbsp; amount:{" "}
                {value.amount} {value.unit} &nbsp; percentage:{" "}
                {value.percentage}%
              </li>
            )
          )}
        </ul>
      </div>
      <div>
        <img
          className="border-black border-solid border-1"
          src={recipe.image}
        />
      </div>
    </div>
  );
};

export default RecipeCard;
