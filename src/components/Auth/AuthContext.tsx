import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../supabaseClient';

interface AuthContextType {
    session: Session | null;
    isLoading: boolean;
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


    return (
        // Provide the authentication context to the component tree
        <AuthContext.Provider value={{ session, isLoading }}> 
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