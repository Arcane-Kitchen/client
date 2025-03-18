import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import RecipeModal from "../components/RecipeModal";
import FilterModal from "../components/FilterModal";
import { useAuth } from "../Auth/AuthContext";
import { PacmanLoader } from "react-spinners";
import { Recipe, Meal, Filter } from "../types";
import { IoSearch, IoChevronBackCircle } from "react-icons/io5";
import { FaFilter } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import moment from "moment";

interface RecipesPageProps {
  recipes: Recipe[];
  mealPlan: Meal[];
  filteredRecipes: Recipe[];
  setFilteredRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  setMealPlan: React.Dispatch<React.SetStateAction<Meal[]>>;
  finishAdding?: () => void;
  selectedDay?: number;
  setSelectedDay?: React.Dispatch<React.SetStateAction<number>>;
  selectedMealType?: string;
  setSelectedMealType?: React.Dispatch<React.SetStateAction<string>>;
  startOfTheWeek?: moment.Moment;
  filters: Filter
  setFilters: React.Dispatch<React.SetStateAction<Filter>>;
}

const RecipesPage: React.FC<RecipesPageProps> = ({ recipes, mealPlan, filteredRecipes, setFilteredRecipes, setMealPlan, finishAdding, selectedDay, setSelectedDay, selectedMealType, setSelectedMealType, startOfTheWeek, filters, setFilters }) => {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { isLoading } = useAuth();

  const filtersCount = Object.values(filters).reduce((count, array) => {
    return count + array.filter(Boolean).length;
  }, 0);

  useEffect(() => {
    const newFilteredRecipes = filteredRecipes.filter((recipe) => recipe.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredRecipes(newFilteredRecipes);
  }, [searchQuery, filteredRecipes])

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

  const handleBackClick = () => {
    setSelectedDay!(moment().day());
    setSelectedMealType!("");
    handleClearAll();
    finishAdding!();
  }

  // Reset all filters
  const handleClearAll = () => {
    const newFilters = { ...filters };

    // Reset each filter array to have all false values
    Object.entries(newFilters).forEach(([key, value]) => {
        newFilters[key as keyof Filter] = value.map(() => false);
    }) 
    setFilters(newFilters);
    setFilteredRecipes(recipes);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }

  return (
    <div className="flex flex-col h-dvh relative">
      {/* Conditionally render a loading spinner or the recipes */}
      {isLoading ? (
        <PacmanLoader className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <>
          {/* Back button, search bar and filter section */}
          <div className="flex items-center p-5 lg:px-15 lg:w-full">
            {/* Back button */}
            <button
              className="flex-1 cursor-pointer lg:left-auto lg:right-2"
              onClick={handleBackClick}
            >
              <IoChevronBackCircle
                size={40}
                className="text-[#19243e] hover:text-slate-600 lg:hidden"
              />
              <FaCircleXmark
                size={40}
                className="text-[#19243e] hover:text-slate-600 hidden lg:block"
              />
            </button>
            <div className="flex items-center w-full justify-end">
              {/* Search input field */}
              <div className="w-2/3 relative lg:flex-0">
                <IoSearch
                  size={20}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-500"
                />
                <input
                  className="pl-12 text-xl shadow w-full appearance-none rounded-lg text-gray-700 focus:outline-none p-2 bg-[#e5e7e9] lg:w-sm lg:text-2xl"
                  placeholder="Search for recipes"
                  value={searchQuery}
                  onChange={handleChange}
                />
              </div>
              {/* Filter button */}
              <button className="px-2 cursor-pointer flex items-end" onClick={toggleFilter}>
                <FaFilter size={30} className=" text-[#19243e]" />
                {/* Display the number of filters applied */}
                {filtersCount > 0 && (
                  <span className=" bg-gray-300 text-xs px-1 h-fit rounded-full">
                    {filtersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {filteredRecipes && filteredRecipes.length > 0 ? (
            // Recipe grid display
            <div className="w-full px-4 pb-5 lg:px-15">
              <p className="mb-2">{`${filteredRecipes.length} ${filteredRecipes.length === 1 ? " result" : "results"} found`}</p>
              <div className="grid grid-cols-2 gap-2 justify-items-center lg:grid-cols-3">
                {/* Render recipe cards */}
                {filteredRecipes.map((recipe, index) => (
                  <div
                    key={index}
                    onClick={() => openModal(recipe)}
                    className="flex items-center w-full gap-5 hover:scale-105 hover:shadow-lg"
                  >
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div> 
            </div>
          ) : (
            <div className="text-center text-3xl mt-5">No Results Found</div>
          )}
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
          selectedDay={selectedDay!}
          setSelectedDay={setSelectedDay!}
          selectedMealType={selectedMealType!}
          setSelectedMealType={setSelectedMealType!}
          startOfTheWeek={startOfTheWeek!}
          finishAdding={finishAdding!}
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
