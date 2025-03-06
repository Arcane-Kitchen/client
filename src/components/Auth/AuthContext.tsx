import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';

interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
    signUp: (email:string, password:string) => Promise<SupabaseResponse>;
    signIn: (email:string, password:string) => Promise<SupabaseResponse>;
    
}

interface SupabaseResponse {
    success: boolean;
    data?: { user: User | null; session: Session | null };
    error?: Error;
}

// Create the AuthContext with an initial undefined value
const AuthContext = createContext<AuthContextType|undefined>(undefined);

// Responsible for managing user authentication state
export const AuthContextProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [session, setSession] = useState<Session|null>(null);
    const [isLoading, setIsLoading] =useState<boolean>(true);

    useEffect(() => {
        // Function to load the session and user profile
        const loadSession = async () => {
            
            // Retrieve session data from Supabase
            const { data : { session } } = await supabase.auth.getSession();
            setSession(session);

            setIsLoading(false);
        };

        loadSession();

        // Listen for authentication state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoading(false);
        })
    
        return () => subscription.unsubscribe()  
    }, [])

    // Signing up with email and password
    const signUp = async (email:string, password:string): Promise<SupabaseResponse> => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })
            
        if (error) {
            console.error('There was an error signing up: ', error);
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
            console.error('There was an error signing in: ', error);
            return { success: false, error }
        }
        return { success: true, data }
    }


    return (
        // Provide the authentication context to the component tree
        <AuthContext.Provider value={{ session, isLoading, signUp, signIn }}> 
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('UserAuth must be used within an AuthContextProvider');
    }
    return context;
}