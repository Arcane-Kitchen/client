import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import SignUp from "./Auth/SignUp";
import RecipesPage from "./pages/RecipesPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import AchievementsPage from "./pages/AchievementsPage";
import Layout from "./pages/Layout";
import NewRecipePage from "./components/NewRecipePage";
import Preferences from "./pages/Preferences";
import { useAuth } from "./Auth/AuthContext";
import { fetchAllRecipes } from "./api/recipeApi";
import { Recipe, Meal, Filter } from "./types";
import AchievementSubscriptionProvider from "./components/AchievementSubscriptionProvider";
import QuestPage from "./pages/QuestPage";
import Chatbot from './components/Chatbot';
import ProtectedRoute from "./Auth/ProtectedRoute";

function App() {
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [filters, setFilters] = useState<Filter>({
    mealType: [false, false, false, false],
    cookingTime: [false, false, false],
    calorieRange: [false, false, false],
    difficultyLevel: [false, false, false],
    dietType: [false, false, false, false, false, false]
  });
  const [previousUserId, setPreviousUserId] = useState<string | null>(null);

  const { setIsLoading, user } = useAuth();
  const location = useLocation();
  const showChatbot = location.pathname === '/recipes' || location.pathname === '/meal-plan';  

  useEffect(() => {
    fetchAllRecipes()
      .then((data) => {
        if (user && user.id !== previousUserId) {
          setPreviousUserId(user.id);
          const recipes = data.filter((recipe: Recipe) => {
            return recipe.user_id === user.id || recipe.user_id === null
          });
          setRecipes(recipes);
          setFilteredRecipes(recipes);
        } else if (!user) {
          const recipes = data.filter((recipe: Recipe) => {
            return recipe.user_id === null
          });
          setRecipes(recipes);
          setFilteredRecipes(recipes);
        }
      })
      .catch((error) => {
        console.error(error);
      }).finally(() => {
        setIsLoading(false);
      })
  }, [user]);

  return (
    <AchievementSubscriptionProvider>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home recipes={recipes} />}></Route>
        <Route path="/" element={<Layout />}>
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="quest" element={<ProtectedRoute><QuestPage /></ProtectedRoute>} />
          <Route path="preferences" element={<ProtectedRoute><Preferences /></ProtectedRoute>} />
          <Route path="new-recipe" element={<ProtectedRoute><NewRecipePage /></ProtectedRoute>} />
          <Route
            path="recipes"
            element={
              <RecipesPage
                recipes={recipes}
                mealPlan={mealPlan}
                setMealPlan={setMealPlan}
                filteredRecipes={filteredRecipes}
                setFilteredRecipes={setFilteredRecipes}
                filters={filters}
                setFilters={setFilters}
                setRecipes={setRecipes}
              />
            }
          />
          <Route path="achievements" element={<ProtectedRoute><AchievementsPage /></ProtectedRoute>} />
          <Route
            path="meal-plan"
            element={
              <ProtectedRoute>
              <CalendarPage
                recipes={recipes}
                filteredRecipes={filteredRecipes}
                setFilteredRecipes={setFilteredRecipes}
                setRecipes={setRecipes}
              />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Home recipes={recipes} />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />      
      {showChatbot && <Chatbot />}
    </AchievementSubscriptionProvider>
  );
}

export default App;
