import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7053/api/Users';
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  authStatus = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt');
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(
        tap((response) => {
          console.log('Login response:', response.message);
          localStorage.setItem('jwt', response.token); // Store token in local storage
          console.log('JWT token stored:', response.token);
          this.updateAuthStatus(true); // Update auth status
          this.router.navigate(['/home']);
        }),
      );
  }

  register(
    name: string,
    email: string,
    password: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/register`,
        { name, email, password },
        { withCredentials: true },
      )
      .pipe(
        tap((response) => {
          console.log('Register response:', response.message);
          localStorage.setItem('jwt', response.token); // Store token in local storage
          console.log('JWT token stored:', response.token);
          this.updateAuthStatus(true); // Update auth status
          this.router.navigate(['/home']);
        }),
      );
  }

  logout(): void {
    this.http
      .post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe(() => {
        console.log('Logged out successfully');
        localStorage.removeItem('jwt'); // Remove token from local storage
        console.log('JWT token removed');
        this.updateAuthStatus(false); // Update auth status
        this.router.navigate(['/login']);
      });
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.log('No token found, user is not authenticated');
      this.updateAuthStatus(false);
      return of(false);
    }

    return this.http
      .get<any>(`${this.apiUrl}/authenticated`, { withCredentials: true })
      .pipe(
        tap((response) => {
          console.log('Is authenticated response:', response);
          const isAuthenticated = response.message === 'Token is valid';
          this.updateAuthStatus(isAuthenticated);
        }),
        catchError((error) => {
          console.error('Error checking authentication', error);
          this.updateAuthStatus(false);
          return of(false);
        }),
      );
  }

  updateAuthStatus(status: boolean): void {
    // Only update if the status has changed
    if (this.authStatusSubject.value !== status) {
      this.authStatusSubject.next(status);
    }
  }
}
