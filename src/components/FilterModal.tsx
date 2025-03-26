import React from 'react';
import { FaFilter } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { Filter, Recipe } from '../types';
import { filterRecipes } from '../util/filterRecipes';
import { mealTypes } from '../util/constants';
import { useAuth } from '../Auth/AuthContext';

interface FilterProps {
    onClose: () => void;
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    recipes: Recipe[];
    setFilteredRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
    handleClearAll: () => void;
    searchQuery: string;
  }

const FilterModal: React.FC<FilterProps> = ({ onClose, filters, setFilters, recipes, setFilteredRecipes, handleClearAll, searchQuery }) => {

    const { user } = useAuth();

    // Toggle the value for a specific filter
    const handleFilterClick = (filterType: keyof Filter, index: number) => {
        const newFilters = { ...filters };

        // Reset the selected filter by setting all values to false
        newFilters[filterType] = newFilters[filterType].map(() => false);
        // Toggle the selected index to true
        newFilters[filterType][index] = !newFilters[filterType][index];
        setFilters(newFilters);
    }

    // Filter the recipes based on the selected filters
    const handleApply = () => {
        const filteredRecipes = filterRecipes(recipes, filters, searchQuery);
        setFilteredRecipes(filteredRecipes);
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-[rgba(255,255,255,0.5)] z-50 w-vh min-h-dvh max-h-dvh lg:flex lg:justify-center lg:items-center">
            <div className="bg-white p-6 rounded-md shadow-2xl mt-17 ml-10 h-[92vh] flex flex-col gap-5 justify-between relative overflow-y-auto lg:mt-0 lg:ml-0 lg:w-1/2 lg:h-fit lg:items-center lg:gap-10">
                <div className="flex gap-5 flex-col lg:w-4/5">
                    {/* Header of the filter modal */}
                    <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <FaFilter />
                            <h1 className="text-2xl text-[#19243e]">Filter</h1>
                        </div>
                        <button className="text-right cursor-pointer hover:bg-gray-200 hover:rounded-full" onClick={onClose}>
                            <IoIosClose className="text-4xl"/>
                        </button>
                    </div>

                    {/* Meal Type Filter */}
                    <div className="flex flex-col gap-2">
                        <h1>Meal Type</h1>
                        <div className="flex gap-2">
                            {mealTypes.map((mealType, index) => (
                                <button 
                                    key={mealType}
                                    className={`cursor-pointer rounded-full py-1 px-2 flex-1 ${filters.mealType[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("mealType", index)}
                                >{mealType}</button>

                            ))}
                        </div>
                    </div>

                    {/* Cooking Time Filter */}
                    <div className="flex flex-col gap-2">
                        <h1>Cooking Time</h1>
                        <div className="flex gap-2">
                            {["< 30 mins", "30 - 60 mins", "> 60 mins"].map((time, index) => (
                                <button 
                                    key={time}
                                    className={`cursor-pointer rounded-full py-1 px-1 flex-1 ${filters.cookingTime[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("cookingTime", index)}
                                >{time}</button>

                            ))}
                        </div>
                    </div>
                    
                    {/* Calorie Range Filter */}
                    <div className="flex flex-col gap-2">
                        <h1>Calorie Range</h1>
                        <div className="flex gap-2">
                            {["< 300 kcal", "300 - 600 kcal", "> 600 kcal"].map((calories, index) => (
                                <button
                                    key={calories}
                                    className={`cursor-pointer rounded-full py-1 flex-1 ${filters.calorieRange[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("calorieRange", index)}
                                >{calories}</button>

                            ))}
                        </div>
                    </div>
                    
                    {/* Difficulty Level Filter */}
                    <div className="flex flex-col gap-2">
                        <h1>Difficulty Level</h1>
                        <div className="flex gap-2">
                            {["Easy", "Average", "Hard"].map((level, index) => (
                                <button
                                    key={level}
                                    className={`cursor-pointer rounded-full py-1 px-2 flex-1 ${filters.difficultyLevel[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("difficultyLevel", index)}
                                >{level}</button>

                            ))}
                        </div>
                    </div>

                    {/* Dietary Restrictions Filter */}
                    <div className="flex flex-col gap-2">
                        <h1>Dietary Restriction</h1>
                        <div className="flex flex-wrap gap-2">
                            {["Gluten free", "Lactose free", "Vegetarian", "Vegan", "Nut free", "Keto"].map((dietType, index) => (
                                <button
                                    key={dietType}
                                    className={`cursor-pointer rounded-full py-1 px-2 ${filters.dietType[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("dietType", index)}
                                >{dietType}</button>

                            ))}
                        </div>
                    </div>

                    {/* Recipe Type Filter */}
                    {user && <div className="flex flex-col gap-2 mb-10">
                        <h1>Recipe Type</h1>
                        <div className="flex gap-2">
                            {["Public", "Private"].map((recipeType, index) => (
                                <button
                                    key={recipeType}
                                    className={`cursor-pointer rounded-full py-1 px-2 flex-1 ${filters.recipeType[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("recipeType", index)}
                                >{recipeType}</button>

                            ))}
                        </div>
                    </div>}
                </div>
                
                {/* Apply and Clear All buttons */}
                <div className="flex flex-col gap-2 lg:w-4/5 lg:flex-row">
                    <button className="cursor-pointer bg-gray-200 rounded-full p-2 hover:scale-105 hover:shadow-lg hover:bg-[#19243e] hover:text-[#ebd6aa] lg:flex-1" onClick={handleClearAll}>Clear All</button>
                    <button className="cursor-pointer bg-[#ebd6aa] text-[#19243e] rounded-full p-2 hover:scale-105 hover:shadow-lg hover:bg-[#19243e] hover:text-[#ebd6aa] lg:flex-1" onClick={handleApply}>Apply</button>
                </div>
            </div>
        </div>
    )
}

export default FilterModal;
