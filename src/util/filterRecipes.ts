import { Recipe, Filter } from "../types";

// Filter by meal type
const filterByMealType = (recipe: Recipe, mealTypeFilters: boolean[]) => {

    const mealTypes = ["breakfast", "lunch", "dinner", "snack"];
    let mealTypeSelected = false;

    for (let i = 0; i < mealTypeFilters.length; i++) {
        if (mealTypeFilters[i]) {
            mealTypeSelected = true;
            if (recipe.meal_type.map((meal) => meal.toLowerCase()).includes(mealTypes[i])) {
                return true; // Return true if the recipe matches one of the selected meal types
            }
        }
    }
    // If no meal type is selected, return true
    return !mealTypeSelected;
}

// Filter by cooking time
const filterByCookingTime = (recipe: Recipe, cookingTimeFilters: boolean[]) => {
    let cookingTimeSelected = false;

    for (let i = 0; i < cookingTimeFilters.length; i++) {
        if (cookingTimeFilters[i]) {
            cookingTimeSelected = true;
            switch (i) {
                case 0: // < 30 mins
                    if (recipe.prep_time < 30) return true;
                    break;
                case 1: // 30 - 60 mins
                    if (recipe.prep_time >= 30 && recipe.prep_time <= 60) return true;
                    break;
                case 2: // > 60 mins
                    if (recipe.prep_time > 60) return true;
                    break;
            }
        }
    }
    // If no cooking time is selected, return true
    return !cookingTimeSelected;
}

// Filter by calorie range
const filterByCalorieRange = (recipe: Recipe, calorieRangeFilters: boolean[]) => {
    let calorieRangeSelected = false;

    for (let i = 0; i < calorieRangeFilters.length; i++) {
        if (calorieRangeFilters[i]) {
            calorieRangeSelected = true;
            switch (i) {
                case 0: // < 300 kcal
                    if (recipe.nutrition.calories < 300) return true;
                    break;
                case 1: // 300 - 600 kcal
                    if (recipe.nutrition.calories >= 300 && recipe.nutrition.calories <= 600) return true;
                    break;
                case 2: // > 600 kcal
                    if (recipe.nutrition.calories > 600) return true;
                    break;
            }
        }
    }
    // If no calorie range is selected, return true
    return !calorieRangeSelected;
}

// Filter by difficulty level
const filterByDifficultyLevel = (recipe: Recipe, difficultyLevelFilters: boolean[]) => {
    let difficultyLevelSelected = false;

    for (let i = 0; i < difficultyLevelFilters.length; i++) {
        if (difficultyLevelFilters[i]) {
            difficultyLevelSelected = true;
            switch (i) {
                case 0: // Easy
                    if (recipe.difficulty.toLowerCase() === "easy") return true;
                    break;
                case 1: // Intermediate
                    if (recipe.difficulty.toLowerCase() === "intermediate") return true;
                    break;
                case 2: // Difficult
                    if (recipe.difficulty.toLowerCase() === "difficult") return true;
                    break;
            }
        }
    }
    // If no difficulty level is selected, return true
    return !difficultyLevelSelected;
}

// Filter by diet type
const filterByDietType = (recipe: Recipe, dietTypeFilters: boolean[]) => {
    let dietTypeSelected = false;

    for (let i = 0; i < dietTypeFilters.length; i++) {
        if (dietTypeFilters[i]) {
            dietTypeSelected = true;
            switch (i) {
                case 0: // Gluten Free
                    if (recipe.diet === "Gluten free") return true;
                    break;
                case 1: // Lactose Free
                    if (recipe.diet === "Lactose free") return true;
                    break;
                case 2: // Vegetarian
                    if (recipe.diet === "Vegetarian") return true;
                    break;
                case 3: // Vegan
                    if (recipe.diet === "Vegan") return true;
                    break;
                case 4: // Nut free
                    if (recipe.diet === "Nut free") return true;
                    break;
                case 5: // Keto
                    if (recipe.diet === "Keto") return true;
                    break;
            }
        }
    }
    // If no difficulty level is selected, return true
    return !dietTypeSelected;
}

// Filter recipes based on selected filters
export const filterRecipes = (recipes: Recipe[], filters: Filter, searchQuery: string) => {

    return recipes.filter((recipe) => {
        const isMealTypeMatch = filterByMealType(recipe, filters.mealType);
        const isCookingTimeMatch = filterByCookingTime(recipe, filters.cookingTime);
        const isCalorieRangeMatch = filterByCalorieRange(recipe, filters.calorieRange);
        const isDifficultyLevelMatch = filterByDifficultyLevel(recipe, filters.difficultyLevel);
        const isDietTypeMatch = filterByDietType(recipe, filters.dietType);

        // Check if the recipe matches the search query
        const isSearchMatch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
        
        // return the recipe if it passes all selected filters
        return isMealTypeMatch && isCookingTimeMatch && isCalorieRangeMatch && isDifficultyLevelMatch && isDietTypeMatch && isSearchMatch;
    })
}