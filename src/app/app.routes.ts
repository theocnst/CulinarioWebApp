import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { RecipeFormComponent } from './pages/recipe/recipe-form/recipe-form.component';
import { RecipeListComponent } from './pages/recipe/recipe-list/recipe-list.component';
import { RecipeSearchComponent } from './pages/recipe/recipe-search/recipe-search.component';
import { ProfileEditComponent } from './pages/user/profile-edit/profile-edit.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { RecipeViewComponent } from './pages/recipe/recipe-view/recipe-view.component';

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
    component: RecipeViewComponent,
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
