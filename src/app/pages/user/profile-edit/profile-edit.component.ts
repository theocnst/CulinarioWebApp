import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserProfile } from '../../../core/models/profile.model';
import { ProfileService } from '../../../core/services/user/profile.service';
import { AuthService } from '../../../core/services/user/auth.service';
import { CloudinaryService } from '../../../core/services/upload.service';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profile-edit.component.html',
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
  backupUrl: string = '';
  submit = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private authService: AuthService,
    private cloudinaryService: CloudinaryService,
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
            this.backupUrl = this.profile.profilePicture;
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

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.[0]) {
      const file = input.files[0];

      // Check if the file type is an image
      if (file.type.match('image.*')) {
        this.cloudinaryService.uploadImage(file).subscribe((response: any) => {
          const cloudinaryImage = response.secure_url;
          this.profile.profilePicture = cloudinaryImage;
          this.onProfilePictureChange(cloudinaryImage);
        });
      } else {
        // Optionally alert the user that only image files are allowed
        alert('Only image files are accepted. Please select an image file.');
      }
    }
  }

  onSubmit(): void {
    this.submit = true;

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

  ngOnDestroy(): void {
    if (!this.submit) this.profileService.updateProfilePicture(this.backupUrl);
  }
}
