import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Auth/Login";
import Home from "./components/Home";
import SignUp from "./Auth/SignUp";
import RecipesPage from "./components/RecipesPage";
import CalendarPage from "./components/CalendarPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}

export default App;
