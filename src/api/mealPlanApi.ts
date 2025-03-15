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

// Fetch user's weekly meal plan
export const fetchUserWeeklyMealPlan = async (id: string, token:string, startDate: string, endDate: string) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/meal-plan?start-date=${startDate}&end-date=${endDate}`, {
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
            body: JSON.stringify({ "hasBeenEaten" : updatedMealPlan.hasBeenEaten })
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

// Updates a user's meal plan by date and meal type
export const updateMealPlanByDateAndMealType = async (id: string, token: string, recipe:Recipe, date: string, mealType: string) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}/meal-plan?date=${date}&meal-type=${mealType}`, {
            method: "PATCH", 
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Supabase-Auth": token,
            },
            body: JSON.stringify({ "recipeId" : recipe.id })
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