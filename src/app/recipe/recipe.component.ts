import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe.model';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../services/recipe.service';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.css',
})
export class RecipeComponent implements OnInit {
  recipe: Recipe | undefined;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!; // Use the non-null assertion operator
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
}
