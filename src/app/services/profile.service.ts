import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'https://localhost:7053/api/UserProfile';

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}/details`);
  }
}
