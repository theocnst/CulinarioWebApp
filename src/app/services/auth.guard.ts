import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    tap((isAuth) => {
      console.log('Auth guard check:', isAuth);
      if (!isAuth) {
        console.warn('User is not authenticated, redirecting to login');
        router.navigate(['/login']);
      } else {
        console.log('User is authenticated');
      }
    }),
    catchError((err) => {
      console.error('Error checking authentication', err);
      router.navigate(['/login']);
      return of(false);
    }),
  );
};
