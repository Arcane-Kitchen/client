const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetches all recipes from the backend
export const fetchAllRecipes = async () => {
  try {
    const response = await fetch(`${baseUrl}/recipes/`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Recipes not found');
      }
      throw new Error('An error occurred while fetching recipes');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching recipes: ', error);
    throw error;
  }
};

// Adds a new recipe to the database
export const addRecipeToDatabase = async (recipeData: any) => {
  try {
    const response = await fetch(`${baseUrl}/recipes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    });

    if (!response.ok) {
      throw new Error('Failed to add recipe');
    }

    return response.json();
  } catch (error) {
    console.error('Error adding recipe:', error);
    throw error;
  }
};

// Fetch a specific recipe
export const fetchARecipeById = async (id: string) => {
    try {
        const response = await fetch(`${baseUrl}/recipes/${id}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Recipe not found");
            }
            throw new Error("An error occurred while fetching recipe");
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching recipe: ", error);
        throw error;
    }
}