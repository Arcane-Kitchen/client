import { Recipe } from "../components/RecipesPage";

const baseUrl = import.meta.env.VITE_API_BASE_URL

// Helper function to calculate the date for a given day of the week
function getDateForDayOfWeek(dayOfWeek:number) {
    const dayToEat = new Date(); 
    const currentDay = dayToEat.getDay();

    // Calculate the difference between the current day and the target day
    const diff = dayOfWeek - currentDay;
    
    // Get the target date by adding/subtracting the difference in days
    dayToEat.setDate(dayToEat.getDate() + diff);
    return dayToEat;
}

// Add a recipe to the user's meal plan
export const addRecipeToMealPlan = async(id: string, token:string, recipe:Recipe, day: number) => {

    const dayToEat = getDateForDayOfWeek(day).toLocaleDateString();

    const body = {
        recipeId: recipe.id,
        dayToEat,
        chosenMealType: recipe.meal_type[0]
    }

    try {
        const response = await fetch(`${baseUrl}/users/${id}/meal-plan`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Supabase-Auth": token,
            },
            body: JSON.stringify(body)
        })

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding recipe to meal plan: ", error);
        throw error;
    }
}