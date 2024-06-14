import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { LikedRecipeOperation } from '../../models/profile.model';
import { CommentsComponent } from '../recipe-comments/comments/comments.component';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommentsComponent],
  templateUrl: './recipe.component.html',
})
export class RecipeComponent implements OnInit {
  recipe: Recipe | undefined;
  isAdmin = false;
  userRating = 0;
  starArray = Array.from({ length: 10 }, (_, i) => i + 1);
  isLiked: boolean = false;
  loggedInUsername: string | null = null;
  likedRecipeDetails: { [key: number]: Recipe } = {};
  currentRecipeId: number | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private recipeService: RecipeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

    this.route.paramMap.subscribe((params) => {
      this.currentRecipeId = +params.get('id')!;
      if (this.currentRecipeId) {
        console.log(`Fetching recipe with ID: ${this.currentRecipeId}`);
        this.recipeService.getRecipeById(this.currentRecipeId).subscribe(
          (data: Recipe) => {
            this.recipe = data;
            console.log('Recipe fetched successfully:', data);
          },
          (error) => {
            console.error('Error fetching recipe:', error);
          },
        );
      }
    });

    this.loggedInUsername = this.authService.getCurrentUsername();
    if (this.loggedInUsername) {
      this.checkIfLiked();
      console.log(`Logged in as: ${this.loggedInUsername}`);
    }
  }

  editRecipe(event: MouseEvent) {
    if (this.recipe && this.recipe.recipeId) {
      console.log('Editing recipe:', this.recipe.recipeId);
      this.router.navigate(['/recipe-form', this.recipe.recipeId]);
    }
  }

  deleteRecipe(event: MouseEvent) {
    if (this.recipe && this.recipe.recipeId) {
      console.log('Deleting recipe:', this.recipe.recipeId);
      this.recipeService.deleteRecipe(this.recipe.recipeId).subscribe(
        () => {
          console.log('Recipe deleted successfully');
          this.router.navigate(['/recipe-list']);
        },
        (error) => {
          console.error('Error deleting recipe:', error);
        },
      );
    }
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

  isStarSelected(star: number): boolean {
    return star === this.userRating;
  }

  rateRecipe(score: number) {
    if (this.recipe && this.recipe.recipeId) {
      const rating = {
        username: this.authService.getCurrentUsername()!,
        recipeId: this.recipe.recipeId,
        score: score,
      };
      console.log(
        `Rating recipe: ${this.recipe.recipeId} with score: ${score}`,
      );

      this.recipeService.rateRecipe(this.recipe.recipeId, rating).subscribe(
        (updatedRecipe) => {
          this.recipe = updatedRecipe;
          this.userRating = score;
          console.log('Recipe rated successfully:', updatedRecipe);
        },
        (error) => {
          console.error('Error rating recipe:', error);
        },
      );
    }
  }

  checkIfLiked(): void {
    if (this.loggedInUsername && this.currentRecipeId) {
      console.log(
        `Checking if recipe is liked by user: ${this.loggedInUsername}`,
      );
      this.profileService.getUserProfile(this.loggedInUsername).subscribe({
        next: (data) => {
          this.isLiked = data.likedRecipes.some(
            (likedRecipe: { recipeId: number | undefined }) =>
              likedRecipe.recipeId === this.currentRecipeId,
          );
          console.log(`Recipe is liked: ${this.isLiked}`);
        },
        error: (err) => {
          console.error('Error loading user profile for likes', err);
        },
      });
    }
  }

  toggleLike(): void {
    if (this.loggedInUsername && this.recipe && this.recipe.recipeId) {
      const operation: LikedRecipeOperation = {
        username: this.loggedInUsername,
        recipeId: this.recipe.recipeId,
      };

      if (this.isLiked) {
        console.log(
          `Unliking recipe: ${this.recipe.recipeId} by user: ${this.loggedInUsername}`,
        );
        this.profileService.unlikeRecipe(operation).subscribe({
          next: () => {
            this.isLiked = false;
            console.log('Recipe unliked successfully');
          },
          error: (err) => {
            console.error('Error unliking recipe', err);
          },
        });
      } else {
        console.log(
          `Liking recipe: ${this.recipe.recipeId} by user: ${this.loggedInUsername}`,
        );
        this.profileService.likeRecipe(operation).subscribe({
          next: () => {
            this.isLiked = true;
            console.log('Recipe liked successfully');
          },
          error: (err) => {
            console.error('Error liking recipe', err);
          },
        });
      }
    }
  }
}
