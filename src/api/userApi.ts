const baseUrl = import.meta.env.VITE_API_BASE_URL

// Make a POST request to create a new user profile
export const createNewUser = async (id:string, username:string, token:string) => {
    console.log("creating new user")
    try {
        const response = await fetch(`${baseUrl}/users/`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Supabase-Auth": token,
            },
            body: JSON.stringify({ "supabaseId": id, username })
        })

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw error;
    }
}

// Fetches the profile of a user by their Supabase Id
export const getUserProfile = async (id:string, token:string) => {
    try {
        const response = await fetch(`${baseUrl}/users/${id}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "X-Supabase-Auth": token,
            },
        })

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
}