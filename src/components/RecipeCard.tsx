import { recipe } from "./RecipesPage";
import { useDraggable } from "@dnd-kit/core";

interface RecipeCardProps {
    recipe: recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: recipe.id,
        data: { recipe },
    });

    const style = {
        opacity: isDragging ? 0.5 : 1,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    };

    return (
        <div 
            ref={setNodeRef} 
            {...listeners}
            {...attributes}
            style={style}
            className="w-full h-full bg-[url('./assets/old-style-paper.png')] bg-cover bg-center px-15 py-5 flex"
        >
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
