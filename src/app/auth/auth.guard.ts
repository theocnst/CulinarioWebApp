import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, of, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated().pipe(
    tap(isAuth => {
      if (!isAuth) {
        console.log('User is not authenticated');
        router.navigate(['/login']);
      } else {
        console.log('User is authenticated');
      }
    }),
    catchError(err => {
      console.error('Error checking authentication', err);
      router.navigate(['/login']);
      return of(false);
    })
  );
};
