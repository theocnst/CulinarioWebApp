import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HomeComponent } from './home/home.component';
import { authGuard } from './services/auth.guard';
import { noAuthGuard } from './services/no-auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { AllRecipesComponent } from './all-recipes/all-recipes.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipeFormComponent } from './recipe-form/recipe-form.component';
import { adminGuard } from './services/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard],
  },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  {
    path: 'profile/:username',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'all-recipes',
    component: AllRecipesComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recipe/:id',
    component: RecipeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recipe-form',
    component: RecipeFormComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
];
