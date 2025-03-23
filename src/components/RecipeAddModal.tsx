import React, { useState } from 'react';
import { addRecipeFromRawText } from '../api/recipeParser';
import { useAuth } from '../Auth/AuthContext';
import { Recipe, Filter } from "../types";
import { filterRecipes } from "../util/filterRecipes";

interface RecipeAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[]
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setFilteredRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  filters: Filter;
}

const RecipeAddModal: React.FC<RecipeAddModalProps> = ({ isOpen, onClose, recipes, setRecipes, setFilteredRecipes, filters }) => {
  const [rawText, setRawText] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const { user } = useAuth();

  const handleAddRecipe = async () => {
    if (user) {
      try {
        setIsAdding(true);
        const result = await addRecipeFromRawText(rawText, user.id);
        setMessage(result.message || 'Recipe added successfully');
        if (result.success && result.recipe) {
          setRawText('');

          const newRecipes = [result.recipe, ...recipes]
          setRecipes(newRecipes);

          const newFilteredRecipes = filterRecipes(newRecipes, filters, "");
          setFilteredRecipes(newFilteredRecipes);
        }
      } catch (error) {
        console.error("Error adding recipe:", error); 
        setMessage('Error adding recipe');
      } finally {
        setIsAdding(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 lg:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Add Recipe</h2>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
          rows={10}
          placeholder="Paste raw recipe text here..."
        />
        <button
          onClick={isAdding ? (e) => e.preventDefault() : handleAddRecipe}
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
            isAdding ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isAdding ? "... Adding" : "Add Recipe"}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg ml-2"
        >
          Close
        </button>
        {message && <p className="mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default RecipeAddModal;