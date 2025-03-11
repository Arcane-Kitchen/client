import React, { useState } from 'react';
import Navbar from './Navbar';
import { addRecipeFromRawText } from '../api/recipeParser';

const NewRecipePage: React.FC = () => {
  const [rawText, setRawText] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addRecipeFromRawText(rawText);
      alert('Recipe added successfully!');
    } catch (error) {
      console.error('Error adding recipe:', error);
      if (error instanceof Error) {
        alert(`Failed to add recipe. Error: ${error.message}`);
      } else {
        alert('Failed to add recipe. An unknown error occurred.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-16">
        <form onSubmit={handleFormSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Add New Recipe</h2>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rawText">
              Recipe Raw Text
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="rawText"
              rows={10}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              required
            />
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Add Recipe
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewRecipePage;