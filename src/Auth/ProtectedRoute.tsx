import { ReactNode } from "react";
import { useAuth } from "./AuthContext";
import { Navigate } from "react-router";
import { FadeLoader } from "react-spinners";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { session, isLoading } = useAuth();

    if(isLoading) {
        return <div className="flex-1 flex items-center justify-center"><FadeLoader /></div>
      }

    // If there is no session, redirect to the landing page
    if (!isLoading && !session) {
        return <Navigate to="/" />;
    }

    // If the user is authenticated, render the protected route's children
    return <>{children}</>;
};

export default ProtectedRoute;
