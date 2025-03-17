const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetch a specific enemy
export const fetchEnemyById = async (id: string) => {
  try {
    const response = await fetch(`${baseUrl}/enemy/${id}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Enemy not found");
      }
      throw new Error("An error occurred while fetching enemy");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching recipe: ", error);
    throw error;
  }
};
