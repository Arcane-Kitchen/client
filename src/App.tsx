import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import SignUp from "./Auth/SignUp";
import RecipesPage from "./pages/RecipesPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./pages/Layout";
import NewRecipePage from './components/NewRecipePage';
import { useAuth } from "./Auth/AuthContext";
import { fetchFullUserMealPlan } from "./api/mealPlanApi";
import { fetchARecipeById } from "./api/recipeApi"

export interface Meal {
  id: string,
  recipe_id: string;
  day_to_eat: string;
  chosen_meal_type: string;
  servings: number;
  exp: number;
  has_been_eaten: boolean;
}

export interface MealPlan {
  id: string;
  title: string;
  start: Date;
  end: Date;
  imageUrl: string,
  hasBeenEaten: boolean;
}

function App() {

  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const { user, session, setIsLoading } = useAuth();

  useEffect(() => {
    if (user && session) {
      setIsLoading(true);
      const fetchUserMealData = async () => {
        try {
          const mealPlan = await fetchFullUserMealPlan(user.id, session.access_token);
          const mappedMealPlan = await Promise.all(mealPlan.map(async (meal: Meal) => {
            let start = new Date(meal.day_to_eat);
  
            if (meal.chosen_meal_type === "breakfast") {
              start.setHours(0, 0, 0);
            } else if (meal.chosen_meal_type === "lunch") {
              start.setHours(8, 0, 0);
            } else {
              start.setHours(16, 0, 0);
            }
  
            let end = new Date(start);
            end.setHours(start.getHours() + 7);
  
            let recipe = await fetchARecipeById(meal.recipe_id)
  
            return {
              id: meal.id,
              title: meal.recipe_id,
              start,
              end,
              imageUrl: recipe.image,
              hasBeenEaten: meal.has_been_eaten,
            }
          }))
          setMealPlan(mappedMealPlan);
        } catch (error:any) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
      fetchUserMealData();
    }
  }, [session])

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} /> {/* Default route */}
        <Route path="profile" element={<ProfilePage />} />
<<<<<<< HEAD
        <Route path="calendar" element={<CalendarPage />} />
        <Route path="/new-recipe" element={<NewRecipePage />} />
=======
        <Route path="recipes" element={<RecipesPage mealPlan={mealPlan} setMealPlan={setMealPlan} />} />
        <Route path="calendar" element={<CalendarPage mealPlan={mealPlan} setMealPlan={setMealPlan} />} />
>>>>>>> 13c4c6c (feat: display previously saved meals in the mini calendar)
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
