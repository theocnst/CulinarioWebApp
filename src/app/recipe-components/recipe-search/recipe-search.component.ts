import { Component, OnInit } from '@angular/core';
import { Recipe, RecipeType, Country } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';
import { FormsModule } from '@angular/forms';
import { RecipeThumbnailComponent } from '../../recipe-components/recipe-thumbnail/recipe-thumbnail.component';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [FormsModule, RecipeThumbnailComponent],

  templateUrl: './recipe-search.component.html',
  styleUrl: './recipe-search.component.css',
})
export class RecipeSearchComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  recipeTypes: RecipeType[] = [];
  countries: Country[] = [];

  showFilters = false;

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
    console.log('Applying filters:', this.filters);
    this.filteredRecipes = this.recipes.filter((recipe) => {
      const matchesName =
        !this.filters.name ||
        recipe.name.toLowerCase().includes(this.filters.name.toLowerCase());
      const matchesCountry =
        !this.filters.country || recipe.countryName === this.filters.country;
      const matchesRecipeType =
        !this.filters.recipeType ||
        recipe.recipeType.name === this.filters.recipeType;
      const matchesTotalTime =
        !this.filters.totalTime || recipe.totalTime <= this.filters.totalTime;
      const matchesAdmin =
        !this.filters.admin ||
        recipe.adminUsername
          .toLowerCase()
          .includes(this.filters.admin.toLowerCase());
      const matchesAverageRating =
        !this.filters.averageRating ||
        (recipe.averageRating ?? 0) >= this.filters.averageRating;
      const matchesNumberOfRatings =
        !this.filters.numberOfRatings ||
        (recipe.numberOfRatings ?? 0) >= this.filters.numberOfRatings;

      const matches =
        matchesName &&
        matchesCountry &&
        matchesRecipeType &&
        matchesTotalTime &&
        matchesAdmin &&
        matchesAverageRating &&
        matchesNumberOfRatings;
      if (matches) {
        console.log('Recipe matches:', recipe);
      }
      return matches;
    });
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
