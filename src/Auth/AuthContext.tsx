import {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";
import { getUserProfile } from "../api/userApi";

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  signUp: (email: string, password: string) => Promise<SupabaseResponse>;
  signIn: (email: string, password: string) => Promise<SupabaseResponse>;
  signOut: () => Promise<SupabaseResponse>;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

interface SupabaseResponse {
  success: boolean;
  data?: { user: User | null; session: Session | null };
  error?: Error;
}

interface UserProfile {
  id: string;
  username: string;
  updated_at: string;
  daily_calorie_goal: number;
  daily_carb_goal: number;
  daily_fat_goal: number;
  daily_protein_goal: number;
  pet_calorie_exp: number;
  pet_carb_exp: number;
  pet_fat_exp: number;
  pet_protein_exp: number;
  pet_wisdom_exp: number;
  pet_name: string;
  pet_img_happy: string;
  pet_img_normal: string;
  pet_img_sad: string;
  enemies_defeated: number;
}

// Create the AuthContext with an initial undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Responsible for managing user authentication state
export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Function to load the session and user profile
    const loadSession = async () => {
      // Retrieve session data from Supabase
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      // Fetch user profile
      if (session && session.user && !user) {
        const userProfile = await getUserProfile(
          session.user.id,
          session.access_token
        );
        setUser(userProfile);
      }

      setIsLoading(false);
    };

    loadSession();

    // Listen for authentication state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);

      if (session && session.user && !user) {
        const userProfile = await getUserProfile(
          session.user.id,
          session.access_token
        );
        setUser(userProfile);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Signing up with email and password
  const signUp = async (
    email: string,
    password: string
  ): Promise<SupabaseResponse> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("There was an error signing up: ", error);
      return { success: false, error };
    }

    return { success: true, data };
  };

  // Signing in with email and password
  const signIn = async (
    email: string,
    password: string
  ): Promise<SupabaseResponse> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("There was an error signing in: ", error);
      return { success: false, error };
    }
    return { success: true, data };
  };

  // Signing out
  const signOut = async (): Promise<SupabaseResponse> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("There was an error signing out: ", error);
      return { success: false, error };
    }

    return { success: true };
  };

  return (
    // Provide the authentication context to the component tree
    <AuthContext.Provider
      value={{
        session,
        user,
        isLoading,
        setIsLoading,
        signUp,
        signIn,
        signOut,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return context;
};
