import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from '../services/profile.service';
import { RecipeService } from '../services/recipe.service';
import { UserProfile, Friend, LikedRecipe } from '../models/profile.model';
import { Recipe } from '../models/recipe.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  username: string | null = null;
  userInfo: UserProfile | null = null;
  friendDetails: { [key: string]: any } = {};
  likedRecipeDetails: { [key: number]: Recipe } = {};
  starArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private recipeService: RecipeService,
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
}
