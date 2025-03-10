import { Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Home from "./pages/Home";
import SignUp from "./Auth/SignUp";
import RecipesPage from "./components/RecipesPage";
import CalendarPage from "./pages/CalendarPage";
import ProfilePage from "./pages/ProfilePage";
import Layout from "./pages/Layout";

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} /> {/* Default route */}
        <Route path="recipes" element={<RecipesPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="calendar" element={<CalendarPage />} />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

export default App;
