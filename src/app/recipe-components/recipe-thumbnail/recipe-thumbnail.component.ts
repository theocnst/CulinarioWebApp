import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from '../../models/recipe.model';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'app-recipe-thumbnail',
  standalone: true,
  imports: [],
  templateUrl: './recipe-thumbnail.component.html',
})
export class RecipeThumbnailComponent implements OnInit {
  @Input() recipe!: Recipe;
  starArray = Array.from({ length: 10 }, (_, i) => i + 1);
  isLiked: boolean = false;
  loggedInUsername: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.loggedInUsername = this.authService.getCurrentUsername();
    if (this.loggedInUsername) {
      this.checkIfLiked();
      console.log(`Logged in as: ${this.loggedInUsername}`);
    }
  }

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

  checkIfLiked(): void {
    if (this.loggedInUsername && this.recipe.recipeId) {
      console.log(
        `Checking if recipe is liked by user: ${this.loggedInUsername}`,
      );
      this.profileService.getUserProfile(this.loggedInUsername).subscribe({
        next: (data) => {
          this.isLiked = data.likedRecipes.some(
            (likedRecipe: { recipeId: number | undefined }) =>
              likedRecipe.recipeId === this.recipe.recipeId,
          );
          console.log(`Recipe is liked: ${this.isLiked}`);
        },
        error: (err) => {
          console.error('Error loading user profile for likes', err);
        },
      });
    }
  }
}
