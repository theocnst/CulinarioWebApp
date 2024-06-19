import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/user/auth.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('adminGuard: Checking admin status');

  return authService.authStatus.pipe(
    map(() => {
      console.log('adminGuard: authStatus observable emitted');
      const isAdmin = authService.isAdmin();
      console.log(`adminGuard: isAdmin() returned ${isAdmin}`);
      if (isAdmin) {
        console.log('User is an admin');
        return true;
      } else {
        console.warn('User is not an admin, redirecting to recipe list');
        router.navigate(['/recipe-list']);
        return false;
      }
    }),
    catchError((err) => {
      console.error('Error checking admin status', err);
      router.navigate(['/recipe-list']);
      return of(false);
    }),
  );
};
