import { Recipe, Meal } from "../types";

const baseUrl = import.meta.env.VITE_API_BASE_URL

// Add a recipe to the user's meal plan
export const addRecipeToMealPlan = async(id: string, token:string, recipe:Recipe, date: string, mealType: string) => {

    const body = {
        recipeId: recipe.id,
        dayToEat: date,
        chosenMealType: mealType,
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

// Fetches all of a user's meal plan
export const fetchFullUserMealPlan = async (id: string, token:string) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/meal-plan`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Supabase-Auth": token,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("User meal plan not found");
            }
            throw new Error("An error occurred while fetching user meal plan");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching user meal plan: ", error);
        throw error;
    }
}

// Updates a user's meal plan by meal plan Id
export const updateMealPlanById = async (id: string, mealPlanId: string, token: string, updatedMealPlan: Partial<Meal>) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/meal-plan/${mealPlanId}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Supabase-Auth": token,
            },
            body: JSON.stringify(updatedMealPlan)
        })
    
        if (!response.ok) {
            throw new Error("An error occurred while updating user meal plan");
        }

        return response.json();
    } catch (error) {
        console.error("Error updating user meal plan: ", error);
        throw error;
    }
}

// Deletes a meal from the user's meal plan
export const removeMealFromMealPlan = async (id: string, token:string, mealPlanId: string) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/meal-plan/${mealPlanId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Supabase-Auth": token,
            },
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("User meal plan not found");
            }
            throw new Error("An error occurred while deleting meal from user meal plan");
        }
    } catch (error) {
        console.error("Error deleting meal from user meal plan: ", error);
        throw error;
    }
}