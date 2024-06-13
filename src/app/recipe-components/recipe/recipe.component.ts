import { Component, OnInit } from '@angular/core';
import { Recipe } from '../../models/recipe.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
})
export class RecipeComponent implements OnInit {
  recipe: Recipe | undefined;
  isAdmin = false;
  userRating = 0;
  starArray = Array.from({ length: 10 }, (_, i) => i + 1);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();

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

  editRecipe(event: MouseEvent) {
    if (this.recipe && this.recipe.recipeId) {
      console.log('Editing recipe');
      console.log('past if statement');

      this.router.navigate(['/recipe-form', this.recipe.recipeId]);
    }
  }

  deleteRecipe(event: MouseEvent) {
    if (this.recipe && this.recipe.recipeId) {
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

      this.recipeService.rateRecipe(this.recipe.recipeId, rating).subscribe(
        (updatedRecipe) => {
          this.recipe = updatedRecipe;
          this.userRating = score;
        },
        (error) => {
          console.error('Error rating recipe:', error);
        },
      );
    }
  }
}
