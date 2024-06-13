import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';

@Component({
  selector: 'app-recipe-thumbnail',
  standalone: true,
  imports: [],
  templateUrl: './recipe-thumbnail.component.html',
  styleUrl: './recipe-thumbnail.component.css',
})
export class RecipeThumbnailComponent {
  @Input() recipe!: Recipe;
  starArray = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(private router: Router) {}

  navigateToRecipe() {
    this.router.navigate(['/recipe', this.recipe.recipeId]);
  }

  getStarFill(star: number): string {
    const rating = this.recipe?.averageRating || 0;
    if (star <= rating) {
      return 'currentColor';
    } else if (star <= rating + 0.5) {
      return 'url(#half-star)'; // This will refer to the gradient for half star
    } else {
      return 'none';
    }
  }
}
