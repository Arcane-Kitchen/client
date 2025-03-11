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