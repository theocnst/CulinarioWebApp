import { Component, HostListener, OnInit, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/user/auth.service';
import { ProfileService } from '../../core/services/user/profile.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
})
export class NavBarComponent implements OnInit {
  isMobileMenuOpen = false;
  isProfileDropdownOpen = false;
  isAdmin = false;
  profilePicture: string | null = null;
  isNavVisible = true;
  lastScrollTop = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
  ) {
    effect(() => {
      this.profilePicture = this.profileService.profilePicture();
    });
  }

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    const username = this.authService.getCurrentUsername();
    if (username) {
      this.profileService.getUserProfilePicture(username).subscribe(
        (urlString) => {
          try {
            this.profileService.profilePicture.set(urlString);
          } catch (e) {
            console.error('Error processing profile picture URL:', e);
          }
        },
        (error) => {
          console.error('Error fetching profile picture:', error);
        },
      );
    }
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

  closeAllDropdowns(event?: MouseEvent): void {
    console.log('Closing all dropdowns');
    const target = event?.target as HTMLElement;
    if (!target?.closest('#user-menu-button')) {
      this.isProfileDropdownOpen = false;
    }
    this.isMobileMenuOpen = false;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: MouseEvent): void {
    console.log('Handling outside click');
    this.closeAllDropdowns(event);
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > this.lastScrollTop) {
      this.isNavVisible = false;
      this.closeAllDropdowns();
    } else {
      this.isNavVisible = true;
    }
    this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
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
}
