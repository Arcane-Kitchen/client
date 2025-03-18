import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import FilterModal from "../components/FilterModal";
import { useAuth } from "../Auth/AuthContext";
import { PacmanLoader } from "react-spinners";
import { Recipe, Meal, Filter } from "../types";
import { IoSearch } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";


interface RecipesPageProps {
  recipes: Recipe[];
  mealPlan: Meal[];
  filteredRecipes: Recipe[];
  setFilteredRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setMealPlan: React.Dispatch<React.SetStateAction<Meal[]>>;
}

const RecipesPage: React.FC<RecipesPageProps> = ({ recipes, mealPlan, filteredRecipes, setFilteredRecipes, setMealPlan }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [filters, setFilters] = useState<Filter>({
    mealType: [false, false, false, false],
    cookingTime: [false, false, false],
    calorieRange: [false, false, false],
    difficultyLevel: [false, false, false],
  })
  

  const { isLoading } = useAuth();

  useEffect(() => {
    // testStatUpdate();
  }, []);

  // const statUpdate = async (statName: string, newAmount: number) => {
  //   await updateUserStat(user?.id, newAmount, statName, session?.access_token);
  // };

  // Open the modal and set the selected recipe
  const openModal = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsModalOpen(true);
  };

  // Close the modal and reset selected recipe
  const closeModal = () => {
    setSelectedRecipe(null);
    setIsModalOpen(false);
  };

  const toggleFilter = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  }

  return (
    <div className="flex flex-col h-dvh relative">
      {/* Conditionally render a loading spinner or the recipes */}
      {isLoading ? (
        <PacmanLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          {/* Search bar and filter section */}
          <div className="flex p-5 lg:px-15 lg:w-full">
            {/* Search input field */}
            <div className="flex-1 relative lg:flex-0">
              <IoSearch
                size={20}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500"
              />
              <input
                className="pl-12 text-xl shadow appearance-none rounded-lg text-gray-700 focus:outline-none p-2 bg-[#e5e7e9] lg:w-sm lg:text-2xl"
                placeholder="Search for recipes"
              />
            </div>
            {/* Filter button */}
            <button className="px-2 cursor-pointer" onClick={toggleFilter}>
              <FaFilter size={25} className=" text-neutral-700" />
            </button>
          </div>

          {/* Recipe grid display */}
          <div className="grid grid-cols-2 gap-5 px-5 pb-5 justify-items-center lg:grid-cols-3 lg:px-15">
            {/* Render recipe cards */}
            {filteredRecipes &&
              filteredRecipes.length > 0 &&
              filteredRecipes.map((recipe, index) => (
                <div
                  key={index}
                  onClick={() => openModal(recipe)}
                  className="flex items-center w-full gap-5 hover:scale-105 hover:shadow-lg"
                >
                  <RecipeCard recipe={recipe} />
                </div>
              ))}
          </div>
        </>
      )}

      {/* Display modal if a recipe is selected */}
      {selectedRecipe && (
        <RecipeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          selectedRecipe={selectedRecipe}
          mealPlan={mealPlan}
          setMealPlan={setMealPlan}
        />
      )}

      {/* Display filter modal when filter button is clicked */}
      {isFilterModalOpen && (
        <FilterModal onClose={toggleFilter} filters={filters} setFilters={setFilters} recipes={recipes} setFilteredRecipes={setFilteredRecipes}/>
      )}
    </div>
  );
};

export default RecipesPage;
