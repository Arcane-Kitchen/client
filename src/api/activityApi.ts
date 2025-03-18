const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const addUserActivity = async (userId: string, recipeId: string) => {
    try {
        const response = await fetch(`${baseUrl}/activity/add-activity`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              recipeId,
              activity_type: "add_recipe",
            }),
          }
        );
        return await response.json();
    } catch (error) {
        console.error("Error adding activity:", error);
    }
}