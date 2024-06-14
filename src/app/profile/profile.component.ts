import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { RecipeService } from '../services/recipe.service';
import { UserProfile, Friendship } from '../models/profile.model';
import { Recipe } from '../models/recipe.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  loggedInUsername: string | null = null;
  userInfo: UserProfile | null = null;
  loggedInUserInfo: UserProfile | null = null; // To store the logged-in user's info
  friendDetails: { [key: string]: any } = {};
  likedRecipeDetails: { [key: number]: Recipe } = {};
  starArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  isFriend: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private recipeService: RecipeService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loggedInUsername = this.authService.getCurrentUsername();
    if (this.loggedInUsername) {
      this.profileService.getUserProfile(this.loggedInUsername).subscribe({
        next: (data) => {
          this.loggedInUserInfo = data;
          this.route.paramMap.subscribe((params) => {
            this.username = params.get('username');
            if (this.username) {
              this.loadUserProfile(this.username);
              this.checkIfFriend();
            }
          });
        },
        error: (err) => {
          console.error('Error loading logged-in user profile', err);
        },
      });
    }
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
        this.loadFriendsDetails();
        this.loadLikedRecipeDetails();
        console.log('User info loaded successfully:', this.userInfo);
      },
      error: (err) => {
        console.error('Error loading user profile', err);
      },
    });
  }

  loadFriendsDetails(): void {
    if (this.userInfo && this.userInfo.friends) {
      this.userInfo.friends.forEach((friend) => {
        this.profileService.getUserProfile(friend.username).subscribe({
          next: (data) => {
            this.friendDetails[friend.username] = data;
            console.log('Friend profile loaded:', data);
          },
          error: (err) => {
            console.error('Error loading friend profile', err);
          },
        });
      });
    }
  }

  loadLikedRecipeDetails(): void {
    if (this.userInfo && this.userInfo.likedRecipes) {
      this.userInfo.likedRecipes.forEach((recipe) => {
        console.log('Loading recipe with ID:', recipe.recipeId);
        this.recipeService.getRecipeById(recipe.recipeId).subscribe({
          next: (data) => {
            this.likedRecipeDetails[recipe.recipeId] = data;
            console.log('Liked recipe loaded:', data);
          },
          error: (err) => {
            console.error('Error loading liked recipe', err);
          },
        });
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  navigateToRecipe(recipeId: number): void {
    this.router.navigate(['/recipe', recipeId]);
  }

  getStarFill(index: number, averageRating: number): string {
    if (index <= averageRating) {
      return 'currentColor';
    } else if (
      index === Math.ceil(averageRating) &&
      !Number.isInteger(averageRating)
    ) {
      return 'url(#half)';
    } else {
      return 'none';
    }
  }

  checkIfFriend(): void {
    if (this.loggedInUserInfo) {
      this.isFriend = this.loggedInUserInfo.friends.some(
        (friend) => friend.username === this.username,
      );
    }
  }

  addFriend(): void {
    if (this.userInfo && this.loggedInUsername) {
      const friendship: Friendship = {
        username: this.loggedInUsername,
        friendUsername: this.userInfo.username,
      };
      this.profileService.addFriend(friendship).subscribe({
        next: (data) => {
          this.isFriend = true;
          this.loadUserProfile(this.userInfo?.username ?? '');
          console.log('Friend added successfully:', data);
        },
        error: (err) => {
          console.error('Error adding friend', err);
        },
      });
    }
  }

  removeFriend(): void {
    if (this.userInfo && this.loggedInUsername) {
      const friendship: Friendship = {
        username: this.loggedInUsername,
        friendUsername: this.userInfo.username,
      };
      this.profileService.removeFriend(friendship).subscribe({
        next: (data) => {
          this.isFriend = false;
          this.loadUserProfile(this.userInfo?.username ?? '');
          console.log('Friend removed successfully:', data);
        },
        error: (err) => {
          console.error('Error removing friend', err);
        },
      });
    }
  }
}
