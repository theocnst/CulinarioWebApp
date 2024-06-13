import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeType, Country } from '../models/recipe.model';
import { RecipeService } from '../services/recipe.service';
import { FormsModule } from '@angular/forms';
import { RecipeThumbnailComponent } from '../recipe-components/recipe-thumbnail/recipe-thumbnail.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule, RecipeThumbnailComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  recipeTypes: RecipeType[] = [];
  countries: Country[] = [];

  filters = {
    name: '',
    country: '',
    recipeType: '',
    totalTime: null,
    admin: '',
    averageRating: null,
    numberOfRatings: null,
  };

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.recipeService.getRecipes().subscribe(
      (data: Recipe[]) => {
        this.recipes = data;
        this.filteredRecipes = this.recipes;
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      },
    );

    this.recipeService.getRecipeTypes().subscribe(
      (data: RecipeType[]) => {
        this.recipeTypes = data;
      },
      (error) => {
        console.error('Error fetching recipe types:', error);
      },
    );

    this.recipeService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      },
    );
  }

  applyFilters(): void {
    this.filteredRecipes = this.recipes.filter((recipe) => {
      return (
        (!this.filters.name ||
          recipe.name
            .toLowerCase()
            .includes(this.filters.name.toLowerCase())) &&
        (!this.filters.country ||
          recipe.countryName === this.filters.country) &&
        (!this.filters.recipeType ||
          recipe.recipeType.name === this.filters.recipeType) &&
        (!this.filters.totalTime ||
          recipe.totalTime <= this.filters.totalTime) &&
        (!this.filters.admin ||
          recipe.adminUsername
            .toLowerCase()
            .includes(this.filters.admin.toLowerCase())) &&
        (!this.filters.averageRating ||
          (recipe.averageRating ?? 0) >= this.filters.averageRating) &&
        (!this.filters.numberOfRatings ||
          (recipe.numberOfRatings ?? 0) >= this.filters.numberOfRatings)
      );
    });
  }
}
