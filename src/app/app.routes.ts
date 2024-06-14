import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { RecipeComponent } from './recipe-components/recipe/recipe.component';
import { RecipeFormComponent } from './recipe-components/recipe-form/recipe-form.component';
import { adminGuard } from './guards/admin.guard';
import { RecipeListComponent } from './recipe-components/recipe-list/recipe-list.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { RecipeSearchComponent } from './recipe-components/recipe-search/recipe-search.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard] },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [noAuthGuard],
  },
  {
    path: 'search',
    component: RecipeSearchComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile/:username',
    component: ProfileComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile-edit/:username',
    component: ProfileEditComponent,
    canActivate: [authGuard],
  },
  {
    path: 'recipe-list',
    component: RecipeListComponent,
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
  {
    path: 'recipe-form/:id',
    component: RecipeFormComponent,
    canActivate: [authGuard, adminGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/recipe-list', pathMatch: 'full' },
];
