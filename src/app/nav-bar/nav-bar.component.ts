import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Ensure the path is correct
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  isAdmin = false;
  username: string | null = null;
  profilePictureURL: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.username = this.authService.getCurrentUsername();
    if (this.username) {
      this.profileService.getUserProfilePicture(this.username).subscribe(
        (profilePictureURL) => {
          this.profilePictureURL = profilePictureURL;
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
        },
      );
    }
    this.profileService.profilePicture$.subscribe((url) => {
      this.profilePictureURL = url;
    });
  }

  toggleMobileMenu(event: MouseEvent): void {
    console.log('Toggling mobile menu');
    event.stopPropagation();
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleProfileDropdown(event: MouseEvent): void {
    console.log('Toggling profile dropdown');
    event.stopPropagation();
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  closeAllDropdowns(event: MouseEvent): void {
    console.log('Closing all dropdowns');
    const target = event.target as HTMLElement;
    if (!target.closest('#user-menu-button')) {
      this.isProfileDropdownOpen = false;
    }
    this.isMobileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    console.log('Handling outside click');
    this.closeAllDropdowns(event);
  }

  onSearchClick(): void {
    console.log('Navigating to search');
    this.router.navigate(['/search']);
  }

  onRecipeListClick(): void {
    console.log('Navigating to recipe list');
    this.router.navigate(['/recipe-list']);
  }

  onAddRecipeClick(): void {
    console.log('Navigating to add recipe');
    this.router.navigate(['/recipe-form']);
  }

  onProfileClick(): void {
    const username = this.authService.getCurrentUsername();
    if (username) {
      this.router.navigate([`/profile/${username}`]);
    } else {
      console.error('No username found in local storage');
    }
  }

  onSettingsClick(): void {
    console.log('Toggling settings');
    const username = this.authService.getCurrentUsername();
    if (username) {
      this.router.navigate([`/profile-edit/${username}`]);
    } else {
      console.error('No username found in local storage');
    }
  }

  onLogoutClick(): void {
    console.log('Logging out');
    this.authService.logout();
  }

  toggleNotificationsDropdown(event: MouseEvent): void {
    console.log('Toggling notifications dropdown');
    // Implement notifications dropdown functionality in the future
    console.error('toggleNotificationsDropdown Method not implemented yet.');
  }
}
