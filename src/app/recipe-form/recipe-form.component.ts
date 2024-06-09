import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeType, Country } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
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

  constructor(private recipeService: RecipeService) {}

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

  onSubmit(): void {
    this.recipeService.addRecipe(this.recipe).subscribe(
      (data: Recipe) => {
        console.log('Recipe added successfully:', data);
        // Redirect or show success message
      },
      (error) => {
        console.error('Error adding recipe:', error);
      },
    );
  }
}
