export interface Ingredient {
  quantity: number;
  unit: string;
  description?: string;
}

export interface Nutrition {
  calories: number;
  macronutrients: {
    fat: { unit: string; amount: number; percentage: number };
    carbs: { unit: string; amount: number; percentage: number };
    protein: { unit: string; amount: number; percentage: number };
  };
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string | null;
  difficulty: string;
  prep_time: number;
  instructions: string[];
  nutrition: Nutrition;
  meal_type: string[];
  ingredients: { [key: string]: Ingredient };
}

export interface MealRawData {
  id: string;
  recipe_id: string;
  day_to_eat: string;
  chosen_meal_type: string;
  servings: number;
  exp: number;
  has_been_eaten: boolean;
}

export interface Meal {
  id: string;
  recipeId: string;
  date: string;
  mealType: "breakfast" | "lunch" | "dinner";
  imageUrl: string;
  hasBeenEaten: boolean;
  exp: number;
  calories: number;
}

export interface Filter {
  mealType: boolean[];
  cookingTime: boolean[];
  calorieRange: boolean[];
  difficultyLevel: boolean[];
}

export interface UserProfile {
  gender: string;
  age: string;
  weight: string;
  height: string;
  activityLevel: string;
  goal: string;
}

export interface DailyCaloriesAndMacros {
  calories: number,
  carbs: {
    grams: number,
    inCalories: number,
    percentage: number,
  },
  fats: {
    grams: number,
    inCalories: number,
    percentage: number,
  },
  protein: {
    grams: number,
    inCalories: number,
    percentage: number,
  }
}

export interface Pet {
  name: string,
  imageUrl: {
    happy: string,
    neutral: string,
    sad: string,
  }
}

export interface Enemy {
  id: string;
  name: string;
  img: string;
  calorie_exp: number;
  carb_exp: number;
  protein_exp: number;
  fat_exp: number;
  wisdom_exp: number;
}
