import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = localStorage.getItem('jwt'); // Get token from local storage
  if (token) {
    console.debug('Adding token to headers:', token);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Ensure credentials are sent with the request
    });
  } else {
    console.debug('No token found in local storage');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleError(error, authService, router);
      return throwError(error);
    }),
  );
};

function handleError(
  error: HttpErrorResponse,
  authService: AuthService,
  router: Router,
) {
  console.error('HTTP Interceptor error:', error);

  if (error.status === 401) {
    console.warn('Token is either expired or invalid');
    localStorage.removeItem('jwt'); // Remove invalid token
    authService.updateAuthStatus(false); // Update auth status
    router.navigate(['/login']);
  } else if (error.status === 0) {
    console.error('Server is unreachable:', error.message);
    localStorage.removeItem('jwt');
    authService.updateAuthStatus(false); // Update auth status on server error
    router.navigate(['/login']);
  } else {
    console.error('An unexpected error occurred:', error.message);
  }
}
