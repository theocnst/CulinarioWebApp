import { Component, Input } from '@angular/core';

import { Router } from '@angular/router';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-recipe-thumbnail',
  standalone: true,
  imports: [],
  templateUrl: './recipe-thumbnail.component.html',
  styleUrls: ['./recipe-thumbnail.component.css'],
})
export class RecipeThumbnailComponent {
  @Input() recipe!: Recipe;

  constructor(private router: Router) {}

  navigateToRecipe(): void {
    this.router.navigate([`/recipe/${this.recipe.recipeId}`]);
  }
}
