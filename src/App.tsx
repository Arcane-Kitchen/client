import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Home from "./components/Home";
import SignUp from "./components/Auth/SignUp";
import RecipeList from "./components/RecipeList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recipes" element={<RecipeList />} />
      </Routes>
    </Router>
  );
}

export default App;
