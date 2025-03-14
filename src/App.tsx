import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import SignUp from "./Auth/SignUp";
import RecipesPage from "./pages/RecipesPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./pages/Layout";
import NewRecipePage from "./components/NewRecipePage";
import { useAuth } from "./Auth/AuthContext";
import { fetchFullUserMealPlan } from "./api/mealPlanApi";
import { fetchAllRecipes, fetchARecipeById } from "./api/recipeApi";
import { Recipe, Meal, MealRawData } from "./types";
import { updateUserLastLoginById } from "./api/userApi";

function App() {
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { user, session, setIsLoading } = useAuth();

  useEffect(() => {
    if (user && session) {
      setIsLoading(true);

      // update user last login date
      const loginDateUpdate = async () => {
        try {
          const today = new Date();
          const userToday = today.toISOString();
          await updateUserLastLoginById(
            user?.id,
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
  }, [session]);

  useEffect(() => {
    fetchAllRecipes()
      .then((data) => {
        setRecipes(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home recipes={recipes} />}></Route>
      <Route path="/" element={<Layout />}>
        <Route path="profile" element={<ProfilePage mealPlan={mealPlan} />} />
        <Route path="new-recipe" element={<NewRecipePage />} />
        <Route path="recipes" element={<RecipesPage recipes={recipes} mealPlan={mealPlan} />}/>
        <Route
          path="meal-plan"
          element={
            <CalendarPage
              mealPlan={mealPlan}
              setMealPlan={setMealPlan}
              recipes={recipes}
            />
          }
        />
      </Route>
      <Route path="*" element={<Home recipes={recipes} />} />
    </Routes>
  );
}

export default App;
