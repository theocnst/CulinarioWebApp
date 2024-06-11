import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authStatus.pipe(
    map((isAuth) => {
      console.log('No auth guard check:', isAuth);
      if (isAuth) {
        console.warn('User is authenticated, redirecting to home');
        router.navigate(['/home']);
        return false;
      }
      return true;
    }),
    catchError((err) => {
      console.error('Error checking authentication', err);
      return of(true);
    }),
  );
};
