const baseUrl = import.meta.env.VITE_API_BASE_URL

// Make a POST request to create a new user profile
export const createNewUser = async (id:string, username:string, token:string) => {
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