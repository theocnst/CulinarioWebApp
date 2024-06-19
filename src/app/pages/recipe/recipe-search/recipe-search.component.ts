import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RecipeThumbnailComponent } from '../recipe-thumbnail/recipe-thumbnail.component';
import { Country, Recipe, RecipeType } from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-search',
  standalone: true,
  imports: [FormsModule, RecipeThumbnailComponent],
  templateUrl: './recipe-search.component.html',
})
export class RecipeSearchComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  recipeTypes: RecipeType[] = [{ name: 'None' }, { name: 'All' }];
  countries: Country[] = [{ countryName: 'None' }, { countryName: 'All' }];

  showFilters = false;

  filters = {
    name: '',
    country: 'None',
    recipeType: 'None',
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
        this.recipeTypes.push(...data);
      },
      (error) => {
        console.error('Error fetching recipe types:', error);
      },
    );

    this.recipeService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries.push(...data);
      },
      (error) => {
        console.error('Error fetching countries:', error);
      },
    );
  }

  applyFilters(): void {
    if (this.hasFilters()) {
      this.filteredRecipes = this.recipes.filter((recipe) => {
        const matchesName =
          !this.filters.name ||
          recipe.name.toLowerCase().includes(this.filters.name.toLowerCase());
        const matchesCountry =
          this.filters.country === 'None' ||
          this.filters.country === 'All' ||
          recipe.countryName === this.filters.country;
        const matchesRecipeType =
          this.filters.recipeType === 'None' ||
          this.filters.recipeType === 'All' ||
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

        return (
          matchesName &&
          matchesCountry &&
          matchesRecipeType &&
          matchesTotalTime &&
          matchesAdmin &&
          matchesAverageRating &&
          matchesNumberOfRatings
        );
      });
    } else {
      this.filteredRecipes = [];
    }
  }

  hasFilters(): boolean {
    return Object.values(this.filters).some(
      (value) => value !== '' && value !== null && value !== 'None',
    );
  }

  toggleFilters() {
    this.showFilters = !this.showFilters;
  }
}
