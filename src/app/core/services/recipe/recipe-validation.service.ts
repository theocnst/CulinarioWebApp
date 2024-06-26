import { Injectable } from '@angular/core';
import { Recipe } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeValidationService {
  errorMessage: string = '';

  validateCurrentStep(recipe: Recipe, currentStep: number): boolean {
    this.errorMessage = '';
    console.log('recipe', recipe);

    switch (currentStep) {
      case 1:
        if (
          !recipe.name ||
          !recipe.image ||
          !recipe.description ||
          !recipe.countryName ||
          !recipe.recipeType.name ||
          recipe.servings === null ||
          recipe.servings === undefined ||
          recipe.servings <= 0 ||
          recipe.prepTime === null ||
          recipe.prepTime === undefined ||
          recipe.prepTime < 0 ||
          recipe.cookTime === null ||
          recipe.cookTime === undefined ||
          recipe.cookTime < 0 ||
          recipe.totalTime === null ||
          recipe.totalTime === undefined ||
          recipe.totalTime <= 0
        ) {
          this.errorMessage =
            'Please fill out all required fields in Step 1.<br>';
          console.log('Validation failed for step 1', {
            name: recipe.name,
            image: recipe.image,
            description: recipe.description,
            countryName: recipe.countryName,
            recipeType: recipe.recipeType.name,
            servings: recipe.servings,
            prepTime: recipe.prepTime,
            cookTime: recipe.cookTime,
            totalTime: recipe.totalTime,
          });
          if (!Number.isInteger(recipe.servings) || recipe.servings <= 0) {
            this.errorMessage += ' Servings must be a positive integer.';
          }
          if (!Number.isInteger(recipe.prepTime) || recipe.prepTime < 0) {
            this.errorMessage += ' Prep time must be a non-negative integer.';
          }
          if (!Number.isInteger(recipe.cookTime) || recipe.cookTime < 0) {
            this.errorMessage += ' Cook time must be a non-negative integer.';
          }
          if (!Number.isInteger(recipe.totalTime) || recipe.totalTime <= 0) {
            this.errorMessage += ' Total time must be a positive integer.';
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
            !Number.isInteger(ingredient.quantity) ||
            ingredient.quantity <= 0
          ) {
            this.errorMessage =
              'Please fill out all ingredient fields with valid values. Quantity must be a positive integer.';
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
          recipe.nutritionInfo.calories <= 0 ||
          !Number.isInteger(recipe.nutritionInfo.fats) ||
          recipe.nutritionInfo.fats <= 0 ||
          !Number.isInteger(recipe.nutritionInfo.carbs) ||
          recipe.nutritionInfo.carbs <= 0 ||
          !Number.isInteger(recipe.nutritionInfo.protein) ||
          recipe.nutritionInfo.protein <= 0 ||
          !Number.isInteger(recipe.nutritionInfo.fiber) ||
          recipe.nutritionInfo.fiber <= 0 ||
          !Number.isInteger(recipe.nutritionInfo.sugar) ||
          recipe.nutritionInfo.sugar <= 0
        ) {
          this.errorMessage =
            'Please enter valid positive integer values for nutrition information.';
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
