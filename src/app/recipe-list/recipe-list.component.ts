import { Component, OnInit } from '@angular/core';

import { RecipeService } from '../services/recipe.service';
import { Recipe } from '../models/recipe.model';
import { RecipeThumbnailComponent } from '../recipe-thumbnail/recipe-thumbnail.component';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [RecipeThumbnailComponent],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.fetchRecipes();
  }

  fetchRecipes(): void {
    this.recipeService.getRecipes().subscribe(
      (data: Recipe[]) => {
        this.recipes = data;
      },
      (error) => {
        console.error('Error fetching recipes:', error);
      },
    );
  }
}
