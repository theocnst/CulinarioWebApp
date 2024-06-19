import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  UserProfile,
  Friendship,
  LikedRecipeOperation,
} from '../../models/profile.model';
import { ConfigService } from '../config.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl: string;

  profilePicture = signal<string>('');

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
    this.apiUrl = this.configService.getConfig().apiUrl + '/UserProfile';
  }

  getUserProfile(username: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${username}/details`);
  }

  updateUserProfile(profile: UserProfile): Observable<UserProfile> {
    return this.http.put<UserProfile>(
      `${this.apiUrl}/${profile.username}`,
      profile,
    );
  }

  updateProfilePicture(url: string): void {
    this.profilePicture.set(url);
  }

  addFriend(friendship: Friendship): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addFriend`, friendship);
  }

  removeFriend(friendship: Friendship): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/removeFriend`, friendship);
  }

  likeRecipe(operation: LikedRecipeOperation): Observable<any> {
    return this.http.post(`${this.apiUrl}/LikeRecipe`, operation);
  }

  unlikeRecipe(operation: LikedRecipeOperation): Observable<any> {
    return this.http.post(`${this.apiUrl}/UnlikeRecipe`, operation);
  }

  getUserProfilePicture(username: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${username}/profilePic`, {
      responseType: 'text',
    });
  }
}
