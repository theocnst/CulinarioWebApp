import { Component, OnInit } from '@angular/core';
import { RecipeThumbnailComponent } from '../recipe-thumbnail/recipe-thumbnail.component';
import { RestoreScrollPositionDirective } from '../../../shared/directives/restore-scroll-position.directive';
import { Recipe } from '../../../core/models/recipe.model';
import { RecipeService } from '../../../core/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [RecipeThumbnailComponent, RestoreScrollPositionDirective],
  templateUrl: './recipe-list.component.html',
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (data: Recipe[]) => {
        this.recipes = data;
      },
      error: (error) => {
        console.error('Error fetching recipes:', error);
      },
    });
  }
}
