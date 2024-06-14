import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { UserProfile, Friendship } from '../models/profile.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = 'https://localhost:7053/api/UserProfile';
  private profilePictureSubject = new BehaviorSubject<string | null>(null);
  profilePicture$ = this.profilePictureSubject.asObservable();

  constructor(private http: HttpClient) {}

  getUserProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}/details`);
  }

  getUserProfilePicture(username: string): Observable<string> {
    return this.http
      .get<any>(`${this.apiUrl}/${username}/details`)
      .pipe(map((data: any) => data.profilePicture));
  }

  updateUserProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/${profile.username}`,
      profile,
    );
  }

  updateProfilePicture(url: string): void {
    this.profilePictureSubject.next(url);
  }

  addFriend(friendship: Friendship): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addFriend`, friendship);
  }

  removeFriend(friendship: Friendship): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/removeFriend`, friendship);
  }
}
