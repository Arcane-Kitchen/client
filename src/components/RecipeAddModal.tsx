import React, { useState, useEffect } from 'react';
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
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);

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
        setMessage('Error adding recipe. Please use decimals instead of fractions.');
      } finally {
        setIsAdding(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getHeightStyle = () => {
    if (screenHeight <= 800) return "72vh";
    return "60vh";
  }; 

  const getPaddingStyle = () => {
    if (screenHeight <= 800) return "0.5rem";
    return "1rem"; 
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(255,255,255,0.6)] z-50 flex items-center justify-center">
      <div 
        className="flex items-center justify-center bg-[url('/input_field.png')] bg-cover bg-center w-full md:bg-[url('/sign-up-box.svg')] md:bg-cover lg:bg-cover lg:w-3/5"
        style={{
          height: getHeightStyle(),
          padding: getPaddingStyle(),
        }}
      >
        <div className="w-4/5 h-full flex flex-col items-center px-6 py-10 gap-4 lg:w-1/2">
          <h2 className="text-2xl font-bold text-center text-white">Add Recipe</h2>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="h-7/11 shadow appearance-none rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline bg-white"
            rows={10}
            placeholder="Paste raw recipe text here..."
          />
          <div className="w-full flex gap-2">
            <button
              onClick={isAdding ? (e) => e.preventDefault() : handleAddRecipe}
              className={`bg-[#ebd6aa] text-[#19243e] px-4 py-2 rounded-lg flex-1 ${
                isAdding ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              {isAdding ? "... Adding" : "Add Recipe"}
            </button>
            <button
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg flex-1"
            >
              Close
            </button>
          </div>
          {message && <p className="text-white mb-2">{message}</p>}
        </div>

      </div>
    </div>
  );
};

export default RecipeAddModal;