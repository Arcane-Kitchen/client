import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import SignUp from "./Auth/SignUp";
import RecipesPage from "./components/RecipesPage";
import CalendarPage from "./components/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./pages/Layout";
import NewRecipePage from './components/NewRecipePage';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} /> {/* Default route */}
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="/new-recipe" element={<NewRecipePage />} />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
