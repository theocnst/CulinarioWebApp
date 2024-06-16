import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';
import { ConfigService } from './config.service';

interface AuthResponse {
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;
  private authStatusSubject = new BehaviorSubject<boolean>(this.hasToken());
  authStatus = this.authStatusSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private configService: ConfigService,
  ) {
    this.apiUrl = this.configService.getConfig().apiUrl + '/UserCredentials';
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('jwt');
  }

  private handleAuthResponse(response: AuthResponse): void {
    console.log('Auth response:', response.message);

    localStorage.setItem('jwt', response.token); // Store token in local storage
    console.log('JWT token stored:', response.token);

    const decodedToken: any = jwtDecode(response.token);
    const username = decodedToken.username; // Extract username from token
    localStorage.setItem('username', username); // Store username
    console.log('Username stored:', username);

    this.updateAuthStatus(true); // Update auth status
    this.router.navigate(['/recipe-list']);
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/login`,
        { email, password },
        { withCredentials: true },
      )
      .pipe(tap((response) => this.handleAuthResponse(response)));
  }

  register(
    username: string,
    email: string,
    password: string,
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${this.apiUrl}/register`,
        { username, email, password },
        { withCredentials: true },
      )
      .pipe(tap((response) => this.handleAuthResponse(response)));
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

  getCurrentUsername(): string | null {
    return localStorage.getItem('username');
  }

  isAdmin(): boolean {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.log('isAdmin: No token found in local storage');
      return false;
    }

    console.log('isAdmin: Token found, decoding token');
    const decodedToken: any = jwtDecode(token);
    console.log('Decoded token:', decodedToken);

    const isAdmin = decodedToken?.role === 'Admin';
    console.log(`isAdmin: User has admin role: ${isAdmin}`);
    return isAdmin;
  }
}
