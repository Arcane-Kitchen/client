import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import { getUserProfile, createNewUser } from "../api/userApi"
import { useLocation } from 'react-router-dom';

interface AuthContextType {
    session: Session | null;
    user: UserProfile | null;
    isLoading: boolean;
    signUp: (username: string, email:string, password:string) => Promise<SupabaseResponse>;
    signIn: (email:string, password:string) => Promise<SupabaseResponse>;
    signOut: () => Promise<SupabaseResponse>;
    
}

interface SupabaseResponse {
    success: boolean;
    data?: { user: User | null; session: Session | null };
    error?: Error;
}

interface UserProfile {
    id: string,
    username: string,
}

// Create the AuthContext with an initial undefined value
const AuthContext = createContext<AuthContextType|undefined>(undefined);

// Responsible for managing user authentication state
export const AuthContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [session, setSession] = useState<Session|null>(null);
    const [user, setUser] = useState<UserProfile|null>(null)
    const [isLoading, setIsLoading] =useState<boolean>(true);
    const location = useLocation();

    useEffect(() => {

        // Function to load the session and user profile
        const loadSession = async () => {
            
            // Retrieve session data from Supabase
            const { data : { session } } = await supabase.auth.getSession();
            setSession(session);

            // Fetch user profile
            if (location.pathname !== '/signup' && session && session.user) {
                const userProfile = await getUserProfile(session.user.id, session.access_token);
                setUser(userProfile);
            }

            setIsLoading(false);
        };

        loadSession();

        // Listen for authentication state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);

            if (location.pathname !== '/signup' && session && session.user) {
                const userProfile = await getUserProfile(session.user.id, session.access_token);
                setUser(userProfile);
            } else {
                setUser(null);
            }

            setIsLoading(false);
        })
    
        return () => subscription.unsubscribe()  
    }, [location.pathname])

    // Signing up with email and password
    const signUp = async (username: string, email:string, password:string): Promise<SupabaseResponse> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
            
        if (error) {
            console.error("There was an error signing up: ", error);
            return { success: false, error };
        }

        try {
            if (data?.user && data?.session) {
                // Create the user profile
                await createNewUser(data.user.id, username, data.session.access_token);
            }
        } catch (error: any) {
            console.error("There was an error creating the user profile: ", error);
            return { success: false, error };
        }

        return { success: true, data };
    }

    // Signing in with email and password
    const signIn = async (email:string, password:string): Promise<SupabaseResponse> => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        if (error) {
            console.error("There was an error signing in: ", error);
            return { success: false, error }
        }
        return { success: true, data }
    }

    // Signing out
    const signOut = async (): Promise<SupabaseResponse> => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("There was an error signing out: ", error);
            return { success: false, error }
        }

        return { success: true }
    }

    return (
        // Provide the authentication context to the component tree
        <AuthContext.Provider value={{ session, user, isLoading, signUp, signIn, signOut }}> 
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("UserAuth must be used within an AuthContextProvider");
    }
    return context;
}