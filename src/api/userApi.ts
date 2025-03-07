const baseUrl = import.meta.env.VITE_API_BASE_URL

// Make a POST request to create a new user profile
export const createUserProfile = async (id:string, username:string) => {
    try {
        const response = await fetch(`${baseUrl}/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'supabaseId': id, username })
        })

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating user profile: ', error);
        throw error;
    }
}