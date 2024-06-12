import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'https://localhost:7053/api/UserProfile';

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}/details`);
  }

  getUserProfilePicture(username: string): Observable<string> {
    return this.http
      .get<any>(`${this.apiUrl}/${username}/details`)
      .pipe(map((data: any) => data.profilePicture));
  }
}
