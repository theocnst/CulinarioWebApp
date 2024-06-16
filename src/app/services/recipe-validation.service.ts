import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeValidationService {
  errorMessage: string = '';

  validateCurrentStep(recipe: Recipe, currentStep: number): boolean {
    this.errorMessage = '';

    switch (currentStep) {
      case 1:
        if (
          !recipe.name ||
          !recipe.image ||
          !recipe.description ||
          !recipe.countryName ||
          !recipe.recipeType.name ||
          !recipe.servings ||
          !recipe.prepTime ||
          !recipe.cookTime ||
          !recipe.totalTime
        ) {
          this.errorMessage =
            'Please fill out all required fields in Step 1.<br>';
          if (!Number.isInteger(recipe.servings)) {
            this.errorMessage += ' Servings must be an integer.';
          }
          if (!Number.isInteger(recipe.prepTime)) {
            this.errorMessage += ' Prep time must be an integer.';
          }
          if (!Number.isInteger(recipe.cookTime)) {
            this.errorMessage += ' Cook time must be an integer.';
          }
          if (!Number.isInteger(recipe.totalTime)) {
            this.errorMessage += ' Total time must be an integer.';
          }
          return false;
        }
        break;
      case 2:
        if (recipe.ingredients.length < 1) {
          this.errorMessage = 'Please add at least one ingredient.';
          return false;
        }
        for (const ingredient of recipe.ingredients) {
          if (
            !ingredient.name ||
            !ingredient.unit ||
            !Number.isInteger(ingredient.quantity)
          ) {
            this.errorMessage =
              'Please fill out all ingredient fields with valid values.';
            return false;
          }
        }
        break;
      case 3:
        if (recipe.instructions.length < 1) {
          this.errorMessage = 'Please add at least one instruction.';
          return false;
        }
        for (const instruction of recipe.instructions) {
          if (!instruction.description) {
            this.errorMessage = 'Please fill out all instruction fields.';
            return false;
          }
        }
        break;
      case 4:
        if (
          !Number.isInteger(recipe.nutritionInfo.calories) ||
          !Number.isInteger(recipe.nutritionInfo.fats) ||
          !Number.isInteger(recipe.nutritionInfo.carbs) ||
          !Number.isInteger(recipe.nutritionInfo.protein) ||
          !Number.isInteger(recipe.nutritionInfo.fiber) ||
          !Number.isInteger(recipe.nutritionInfo.sugar)
        ) {
          this.errorMessage =
            'Please enter valid integer values for nutrition information.';
          return false;
        }
        break;
    }
    return true;
  }

  validateForm(recipe: Recipe): boolean {
    for (let step = 1; step <= 4; step++) {
      if (!this.validateCurrentStep(recipe, step)) {
        return false;
      }
    }
    return true;
  }
}
