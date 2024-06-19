import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe, RecipeType, Country } from '../../../core/models/recipe.model';
import { CloudinaryService } from '../../../core/services/upload.service';
import { RecipeValidationService } from '../../../core/services/recipe/recipe-validation.service';
import { RecipeService } from '../../../core/services/recipe/recipe.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './recipe-form.component.html',
})
export class RecipeFormComponent implements OnInit {
  recipe: Recipe = {
    name: '',
    image: '',
    prepTime: 0,
    cookTime: 0,
    totalTime: 0,
    servings: 0,
    description: '',
    adminUsername: localStorage.getItem('username') || '',
    countryName: '',
    recipeType: { name: '' },
    nutritionInfo: {
      calories: 0,
      fats: 0,
      carbs: 0,
      protein: 0,
      fiber: 0,
      sugar: 0,
    },
    ingredients: [],
    instructions: [],
  };
  recipeTypes: RecipeType[] = [];
  countries: Country[] = [];
  currentStep: number = 1;
  isEditing: boolean = false;
  errorMessage: string = '';
  imageUrl: string = '';

  constructor(
    private recipeService: RecipeService,
    private validationService: RecipeValidationService,
    private router: Router,
    private route: ActivatedRoute,
    private cloudinaryService: CloudinaryService,
  ) {}

  ngOnInit(): void {
    this.fetchRecipeTypes();
    this.fetchCountries();

    // Fetch recipe if editing
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

  fetchRecipeTypes(): void {
    this.recipeService.getRecipeTypes().subscribe(
      (data: RecipeType[]) => {
        this.recipeTypes = data;
      },
      (error) => {
        console.error('Error fetching recipe types:', error);
      },
    );
  }

  fetchCountries(): void {
    this.recipeService.getCountries().subscribe(
      (data: Country[]) => {
        this.countries = data;
      },
      (error) => {
        console.error('Error fetching countries:', error);
      },
    );
  }

  nextStep(): void {
    if (
      this.validationService.validateCurrentStep(this.recipe, this.currentStep)
    ) {
      this.currentStep++;
    } else {
      this.errorMessage = this.validationService.errorMessage;
    }
  }

  prevStep(): void {
    this.currentStep--;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];
      this.cloudinaryService.uploadImage(file).subscribe(
        (response: any) => {
          this.imageUrl = response.secure_url;
          this.recipe.image = this.imageUrl;
        },
        (error) => {
          console.error('Error uploading image:', error);
          this.errorMessage = 'Error uploading image';
        },
      );
    }
  }

  calculateTotalTime(): void {
    this.recipe.totalTime = this.recipe.prepTime + this.recipe.cookTime;
  }

  onSubmit(): void {
    if (this.validationService.validateForm(this.recipe)) {
      if (this.recipe.recipeId) {
        this.recipeService.updateRecipe(this.recipe).subscribe(
          (data: Recipe) => {
            console.log('Recipe updated successfully:', data);
            this.router.navigate(['/recipe-list']);
          },
          (error) => {
            console.error('Error updating recipe:', error);
            this.errorMessage = 'Error updating recipe.';
          },
        );
      } else {
        this.recipeService.addRecipe(this.recipe).subscribe(
          (data: Recipe) => {
            console.log('Recipe added successfully:', data);
            this.router.navigate(['/recipe-list']);
          },
          (error) => {
            console.error('Error adding recipe:', error);
            this.errorMessage = 'Error adding recipe.';
          },
        );
      }
    } else {
      this.errorMessage = this.validationService.errorMessage;
    }
  }

  addIngredient(): void {
    this.recipe.ingredients.push({ name: '', quantity: 0, unit: '' });
  }

  removeIngredient(index: number): void {
    this.recipe.ingredients.splice(index, 1);
  }

  addInstruction(): void {
    const newStepNumber = this.recipe.instructions.length + 1;
    this.recipe.instructions.push({
      stepNumber: newStepNumber,
      description: '',
    });
  }

  removeInstruction(index: number): void {
    this.recipe.instructions.splice(index, 1);
    this.updateStepNumbers();
  }

  updateStepNumbers(): void {
    this.recipe.instructions.forEach((instruction, index) => {
      instruction.stepNumber = index + 1;
    });
  }

  enableEdit() {
    this.isEditing = true;
  }

  disableEdit() {
    this.isEditing = false;
  }

  closeModal() {
    this.errorMessage = '';
  }
}
