import React, { useState } from 'react';

interface NewRecipeFormProps {
  onSubmit: (recipeData: any) => void;
}

const NewRecipeForm: React.FC<NewRecipeFormProps> = ({ onSubmit }) => {
  const [recipeData, setRecipeData] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(recipeData);
      onSubmit(parsedData);
    } catch (error) {
      console.error('Invalid JSON:', error);
      alert('Invalid JSON format. Please check your input.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4">Add New Recipe</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="recipeData">
          Recipe JSON
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="recipeData"
          rows={10}
          value={recipeData}
          onChange={(e) => setRecipeData(e.target.value)}
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
  );
};

export default NewRecipeForm;