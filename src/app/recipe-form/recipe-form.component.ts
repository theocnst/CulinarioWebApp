import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeType, Country } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';

import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.fetchRecipeTypes();
    this.fetchCountries();

    // Fetch recipe if editing
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      if (id) {
        this.recipeService.getRecipeById(id).subscribe(
          (data: Recipe) => {
            this.recipe = data;
          },
          (error) => {
            console.error('Error fetching recipe:', error);
          },
        );
      }
    });
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
    if (this.recipe.recipeId) {
      this.recipeService.updateRecipe(this.recipe).subscribe(
        (data: Recipe) => {
          console.log('Recipe updated successfully:', data);
          this.router.navigate([`/recipe-list`]);
        },
        (error) => {
          console.error('Error updating recipe:', error);
        },
      );
    } else {
      this.recipeService.addRecipe(this.recipe).subscribe(
        (data: Recipe) => {
          console.log('Recipe added successfully:', data);
          this.router.navigate([`/recipe-list`]);
        },
        (error) => {
          console.error('Error adding recipe:', error);
        },
      );
    }
  }
}
