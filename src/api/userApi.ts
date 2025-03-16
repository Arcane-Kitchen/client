const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Make a POST request to create a new user profile
export const createNewUser = async (
  id: string,
  username: string,
  token: string
) => {
  try {
    const response = await fetch(`${baseUrl}/users/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Supabase-Auth": token,
      },
      body: JSON.stringify({ supabaseId: id, username }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating user profile: ", error);
    throw error;
  }
};

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

// update user stat by chosen amount
export const updateUserStat = async (
  id: string | undefined,
  amount: number,
  stat: string,
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
      body: JSON.stringify({ statAmount: amount, chosenStat: stat }),
    });

    if (!response.ok) {
      throw new Error("An error occurred while updating stat");
    }

    return response.json();
  } catch (error) {
    console.error("Error updating stat: ", error);
    throw error;
  }
};
