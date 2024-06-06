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
    console.log('Adding token to headers: ' + token);
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // Ensure credentials are sent with the request
    });
  } else {
    console.log('No token found in local storage');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('Interceptor error: ', error);
      if (error.status === 401) {
        console.log('Token is either expired or invalid');
        router.navigate(['/login']);
      }
      return throwError(error);
    }),
  );
};
