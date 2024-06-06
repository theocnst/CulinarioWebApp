import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface AuthResponse {
  token: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7053/api/Users';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap(response => {
        console.log('Login response: ', response.message);
        localStorage.setItem('jwt', response.token); // Store token in local storage
        this.router.navigate(['/home']);
      })
    );
  }

  register(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { name, email, password }, { withCredentials: true }).pipe(
      tap(response => {
        console.log('Register response: ', response.message);
        localStorage.setItem('jwt', response.token); // Store token in local storage
        this.router.navigate(['/home']);
      })
    );
  }

  logout(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      console.log('Logged out successfully');
      localStorage.removeItem('jwt'); // Remove token from local storage
      this.router.navigate(['/login']);
    });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/authenticated`, { withCredentials: true }).pipe(
      tap(response => {
        console.log('Is authenticated response: ', response);
      })
    );
  }
}
