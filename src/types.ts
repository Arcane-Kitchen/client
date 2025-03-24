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
  diet: "Omnivore" | "Gluten free" | "Lactose free" | "Vegetarian" | "Vegan" | "Nut free" | "Keto" | null;
  user_id: string | null;
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
  macronutrients: {
    fat: number;
    carbs: number;
    protein: number;
  }
}

export interface Filter {
  mealType: boolean[];
  cookingTime: boolean[];
  calorieRange: boolean[];
  difficultyLevel: boolean[];
  dietType: boolean[];
  recipeType: boolean[];
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
  imageUrl: string,
  stats: {
    calorieExp: number,
    carbExp: number,
    proteinExp: number,
    fatExp: number,
    wisdomExp: number,
}
}
