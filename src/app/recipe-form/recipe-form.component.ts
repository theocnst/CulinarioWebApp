import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeType, Country } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css'],
})
export class RecipeFormComponent implements OnInit {
  recipe: Recipe = {
    name: '',
    image: '',
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    servings: 0,
    description: '',
    adminUsername: localStorage.getItem('username') || '',
    countryName: '',
    recipeType: { name: '' },
    nutritionInfo: {
      calories: 0,
      fats: 0,
      carbs: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
    },
    ingredients: [],
    instructions: [],
  };
  recipeTypes: RecipeType[] = [];
  countries: Country[] = [];
  currentStep: number = 1;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchRecipeTypes();
    this.fetchCountries();
  }

  fetchRecipeTypes(): void {
    this.recipeService.getRecipeTypes().subscribe(
      (data: RecipeType[]) => {
        this.recipeTypes = data;
      },
      (error) => {
        console.error('Error fetching recipe types:', error);
      },
    );
  }

  fetchCountries(): void {
    this.recipeService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      },
    );
  }

  nextStep(): void {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  onSubmit(): void {
    console.log('Recipe:', this.recipe);
    this.recipeService.addRecipe(this.recipe).subscribe(
      (data: Recipe) => {
        console.log('Recipe added successfully:', data);
        // change router to navigate to the recipe details page
        this.router.navigate([`/home`]);
      },
      (error) => {
        console.error('Error adding recipe:', error);
      },
    );
  }
}
