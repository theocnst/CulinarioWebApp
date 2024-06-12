import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { AuthService } from '../services/auth.service';
import { UserProfile } from '../models/profile.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css'],
})
export class ProfileEditComponent implements OnInit {
  profile: UserProfile = {
    username: '',
    firstName: '',
    lastName: '',
    profilePicture: '',
    description: '',
    dateOfBirth: '',
    friends: [],
    likedRecipes: [],
  };
  username: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getCurrentUsername();
    if (this.username) {
      this.profileService.getUserProfile(this.username).subscribe(
        (data) => {
          console.log('Profile data fetched successfully:', data);
          this.profile = data;
          if (this.profile.dateOfBirth) {
            const date = new Date(this.profile.dateOfBirth);
            this.profile.dateOfBirth = date.toISOString().substring(0, 10);
          }
        },
        (error) => {
          console.error('Error fetching profile:', error);
          this.errorMessage = 'Error fetching profile';
        },
      );
    }
  }

  validateDateOfBirth(dateOfBirth: string): boolean {
    const date = new Date(dateOfBirth);
    const currentYear = new Date().getFullYear();
    const birthYear = date.getFullYear();
    if (birthYear > currentYear || birthYear < currentYear - 100) {
      this.errorMessage =
        'Year of birth must be between the current year and 100 years ago.';
      return false;
    }
    this.errorMessage = null;
    return true;
  }

  onProfilePictureChange(url: string): void {
    this.profileService.updateProfilePicture(url);
  }

  onSubmit(): void {
    if (!this.validateDateOfBirth(this.profile.dateOfBirth)) {
      return;
    }

    console.log('Submitting profile update:', this.profile);
    this.profileService.updateUserProfile(this.profile).subscribe(
      (updatedProfile) => {
        console.log('Profile updated successfully:', updatedProfile);
        this.router.navigate(['/profile', this.username]);
      },
      (error) => {
        console.error('Error updating profile:', error);
        this.errorMessage = 'Error updating profile';
      },
    );
  }

  onCancel(): void {
    this.router.navigate(['/profile', this.username]);
  }
}
