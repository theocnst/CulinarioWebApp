export interface NutritionInfo {
  calories: number;
  fats: number;
  carbs: number;
  protein: number;
  fiber: number;
  sugar: number;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Instruction {
  stepNumber: number;
  description: string;
}

export interface RecipeType {
  name: string;
}

export interface Country {
  countryName: string;
}

export interface Recipe {
  recipeId?: number;
  name: string;
  image: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  description: string;
  adminUsername: string;
  countryName: string;
  recipeType: RecipeType;
  nutritionInfo: NutritionInfo;
  ingredients: Ingredient[];
  instructions: Instruction[];
}
