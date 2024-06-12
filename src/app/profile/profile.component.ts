import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { UserProfile } from '../models/profile.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  userInfo: UserProfile | null = null;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.username = params.get('username');
      if (this.username) {
        this.loadUserProfile(this.username);
      }
    });
  }

  loadUserProfile(username: string): void {
    this.profileService.getUserProfile(username).subscribe({
      next: (data) => {
        this.userInfo = data;
        if (this.userInfo && this.userInfo.dateOfBirth) {
          this.userInfo.dateOfBirth = this.formatDate(
            this.userInfo.dateOfBirth,
          );
        }
        //print the user data in detail
        console.log('User info loaded successfully:', this.userInfo);
      },
      error: (err) => {
        console.error('Error loading user profile', err);
      },
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}
