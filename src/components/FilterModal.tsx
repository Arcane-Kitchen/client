import React from 'react';
import { FaFilter } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { Filter, Recipe } from '../types';
import { filterRecipes } from '../util/filterRecipes';

interface FilterProps {
    onClose: () => void;
    filters: Filter;
    setFilters: React.Dispatch<React.SetStateAction<Filter>>;
    recipes: Recipe[];
    setFilteredRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  }

const FilterModal: React.FC<FilterProps> = ({ onClose, filters, setFilters, recipes, setFilteredRecipes }) => {

    const handleFilterClick = (filterType: keyof Filter, index: number) => {
        const newFilters = { ...filters };
        newFilters[filterType] = newFilters[filterType].map(() => false);
        newFilters[filterType][index] = !newFilters[filterType][index];
        setFilters(newFilters);
    }

    const handleApply = () => {
        const filteredRecipes = filterRecipes(recipes, filters);
        setFilteredRecipes(filteredRecipes);
        onClose();
    }

    const handleClearAll = () => {
        const newFilters = { ...filters };
        Object.entries(newFilters).forEach(([key, value]) => {
            newFilters[key as keyof Filter] = value.map(() => false);
        }) 
        setFilters(newFilters);
        setFilteredRecipes(recipes);
    }

    return (
        <div className="fixed inset-0 bg-[rgba(255,255,255,0.5)] z-50 w-vh h-vh lg:flex lg:justify-center lg:items-center">
            <div className="bg-white p-6 rounded-md shadow-2xl mt-17 ml-15 h-[92vh] flex flex-col gap-5 justify-between relative">
                <div className="flex gap-5 flex-col">
                    <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2 items-center">
                            <FaFilter />
                            <h1 className="text-2xl text-[#19243e]">Filter</h1>
                        </div>
                        <button className="text-right cursor-pointer hover:bg-gray-200 hover:rounded-full" onClick={onClose}>
                            <IoIosClose className="text-4xl"/>
                        </button>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1>Meal Type</h1>
                        <div className="flex gap-2">
                            {["Breakfast", "Lunch", "Dinner", "Snack"].map((mealType, index) => (
                                <button 
                                    className={`cursor-pointer rounded-full py-1 px-2 flex-1 ${filters.mealType[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("mealType", index)}
                                >{mealType}</button>

                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1>Cooking Time</h1>
                        <div className="flex gap-2">
                            {["< 30 mins", "30 - 60 mins", "> 60 mins"].map((time, index) => (
                                <button 
                                    className={`cursor-pointer rounded-full py-1 px-2 flex-1 ${filters.cookingTime[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("cookingTime", index)}
                                >{time}</button>

                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1>Calorie Range</h1>
                        <div className="flex gap-2">
                            {["< 300 kcal", "300 - 600 kcal", "> 600 kcal"].map((calories, index) => (
                                <button 
                                    className={`cursor-pointer rounded-full py-1 px-2 flex-1 ${filters.calorieRange[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("calorieRange", index)}
                                >{calories}</button>

                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1>Difficulty Level</h1>
                        <div className="flex gap-2">
                            {["Easy", "Intermediate", "Difficult"].map((level, index) => (
                                <button 
                                    className={`cursor-pointer rounded-full py-1 px-2 flex-1 ${filters.difficultyLevel[index] ? "bg-[#19243e] text-[#ebd6aa]" : "bg-gray-200 text-[#19243e]"}`}
                                    onClick={() => handleFilterClick("difficultyLevel", index)}
                                >{level}</button>

                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1>Dietary Preferences</h1>
                        <div className="flex gap-2">
                            <button className="cursor-pointer bg-gray-200 rounded-full px-2 py-1">Vegan</button>
                            <button className="cursor-pointer bg-gray-200 rounded-full px-2 py-1">Gluten-free</button>
                            <button className="cursor-pointer bg-gray-200 rounded-full px-2 py-1">Keto</button>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col gap-2">
                    <button className="cursor-pointer bg-gray-200 rounded-full p-2 hover:scale-105 hover:shadow-lg hover:bg-[#19243e] hover:text-[#ebd6aa]" onClick={handleClearAll}>Clear All</button>
                    <button className="cursor-pointer bg-[#ebd6aa] text-[#19243e] rounded-full p-2 hover:scale-105 hover:shadow-lg hover:bg-[#19243e] hover:text-[#ebd6aa]" onClick={handleApply}>Apply</button>
                </div>
            </div>
        </div>
    )
}

export default FilterModal;
