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
import { fetchFullUserMealPlan } from "./api/mealPlanApi";
import { fetchAllRecipes, fetchARecipeById } from "./api/recipeApi";
import { Recipe, Meal, MealRawData, Filter } from "./types";
import { updateUserLastLoginById } from "./api/userApi";
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
  });
  const { user, session, setIsLoading } = useAuth();
  const location = useLocation();
  const showChatbot = location.pathname === '/recipes' || location.pathname === '/meal-plan';  

  useEffect(() => {
    if (user && session) {
      setIsLoading(true);

      // update user last login date
      const loginDateUpdate = async () => {
        try {
          const today = new Date();
          const userToday = today.toISOString();
          await updateUserLastLoginById(
            user.id,
            userToday,
            session?.access_token
          );
        } catch (error: any) {
          console.error(error);
        }
      };

      // fetch use meal data
      const fetchUserMealData = async () => {
        try {
          const mealPlan = await fetchFullUserMealPlan(
            user.id,
            session.access_token
          );
          const mappedMealPlan = await Promise.all(
            mealPlan.map(async (meal: MealRawData) => {
              const date = new Date(meal.day_to_eat).toLocaleDateString();
              const recipe = await fetchARecipeById(meal.recipe_id);

              return {
                id: meal.id,
                recipeId: meal.recipe_id,
                date,
                mealType: meal.chosen_meal_type,
                imageUrl: recipe.image,
                hasBeenEaten: meal.has_been_eaten,
                exp: meal.exp,
                calories: recipe.nutrition.calories,
              };
            })
          );
          setMealPlan(mappedMealPlan);
        } catch (error: any) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      loginDateUpdate();
      fetchUserMealData();
    }
  }, [session, user]);

  useEffect(() => {
    fetchAllRecipes()
      .then((data) => {
        setRecipes(data);
        setFilteredRecipes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

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
                mealPlan={mealPlan}
                setMealPlan={setMealPlan}
                filteredRecipes={filteredRecipes}
                setFilteredRecipes={setFilteredRecipes}
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
