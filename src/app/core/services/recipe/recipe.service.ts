import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';
import { Recipe, RecipeType, Country, Rating } from '../../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
    this.apiUrl = this.configService.getConfig().apiUrl + '/Recipe';
  }
  getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(`${this.apiUrl}/all`);
  }

  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<Recipe>(`${this.apiUrl}/${id}`);
  }

  getRecipeTypes(): Observable<RecipeType[]> {
    return this.http.get<RecipeType[]>(`${this.apiUrl}/recipetypes`);
  }

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.apiUrl}/countries`);
  }

  addRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.apiUrl, recipe);
  }

  updateRecipe(recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.apiUrl}/${recipe.recipeId}`, recipe);
  }

  deleteRecipe(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  rateRecipe(recipeId: number, rating: Rating): Observable<Recipe> {
    return this.http.post<Recipe>(`${this.apiUrl}/${recipeId}/rate`, rating);
  }
}
