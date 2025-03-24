import { DailyCaloriesAndMacros, Pet } from "../types";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Fetches the profile of a user by their Supabase Id
export const getUserProfile = async (id: string, token: string) => {
  try {
    const response = await fetch(`${baseUrl}/users/${id}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Supabase-Auth": token,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("User profile not found");
      }
      throw new Error("An error occurred while fetching user profile");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    throw error;
  }
};

// update last user login
export const updateUserLastLoginById = async (
  id: string | undefined,
  givenDate: string,
  token: string
) => {
  try {
    const response = await fetch(`${baseUrl}/users/${id}/login`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Supabase-Auth": token,
      },
      body: JSON.stringify({ date: givenDate }),
    });

    if (!response.ok) {
      throw new Error("An error occurred while updating last user login");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating last user login date: ", error);
    throw error;
  }
};

// update user's pet stat by chosen amount
export const updateUserPetStat = async (
  id: string, stats : {
    carb?: number
    fat?: number,
    protein?: number,
    calorie?: number,
    wisdom?: number,
    enemiesDefeated?: number,
  },
  token: string
) => {
  try {
    const response = await fetch(`${baseUrl}/users/${id}/stat`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Supabase-Auth": token,
      },
      body: JSON.stringify(stats),
    });

    if (!response.ok) {
      throw new Error("An error occurred while updating pet stat");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating pet stat: ", error);
    throw error;
  }
};

// update user's calorie and macros goal
export const updateUserCalorieAndMacrosGoal = async (id: string, token: string, userGoal: DailyCaloriesAndMacros | null) => {
  try {
    const response = await fetch(`${baseUrl}/users/${id}/goals`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Supabase-Auth": token,
      },
      body: JSON.stringify(userGoal),
    });

    if (!response.ok) {
      throw new Error("An error occurred while updating user goals");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating user goals: ", error);
    throw error;
  }
};

// update user's pet
export const updateUserPet = async (id: string, token: string, pet: Pet) => {
  try {
    const response = await fetch(`${baseUrl}/users/${id}/pet`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Supabase-Auth": token,
      },
      body: JSON.stringify(pet),
    });

    if (!response.ok) {
      throw new Error("An error occurred while updating pet");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating pet: ", error);
    throw error;
  }
};
