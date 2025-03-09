import { recipe } from "./RecipesPage";
import { useDroppable } from "@dnd-kit/core";

interface RecipeCardProps {
    recipe: recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {

    const { isOver, setNodeRef } = useDroppable({
        id: recipe.id
    })

    const style = {
        opacity: isOver ? 0.5 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} className="w-full h-full bg-[url('./assets/old-style-paper.png')] bg-cover bg-center px-15 py-5 flex">
            <div className="flex flex-col gap-3">
                <h1>{recipe.name}</h1>
                <p>{recipe.description}</p>
            </div>
            <div>
                <img src={recipe.image} />
            </div>  
        </div>
    )
}

export default RecipeCard
