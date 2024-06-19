import { Component, OnInit, computed, effect, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Friend,
  Friendship,
  UserProfile,
} from '../../../core/models/profile.model';
import { Recipe } from '../../../core/models/recipe.model';
import { ProfileService } from '../../../core/services/user/profile.service';
import { AuthService } from '../../../core/services/user/auth.service';
import { RecipeService } from '../../../core/services/recipe/recipe.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  username = signal<string | null>(null);
  loggedInUsername = signal<string>('');

  userInfo = signal<UserProfile | null>(null);
  loggedInUserInfo = signal<UserProfile | null>(null);

  friendDetails = signal<{ [key: string]: any }>({});
  likedRecipeDetails = signal<{ [key: number]: Recipe }>({});

  starArray: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  isLoading = signal<boolean>(true);

  isFriend = computed(() => {
    console.log(
      'Checking if friend:',
      this.loggedInUserInfo(),
      this.username(),
    );
    const loggedInUser = this.loggedInUserInfo();
    const currentUsername = this.username();
    return loggedInUser
      ? loggedInUser.friends.some(
          (friend) => friend.username === currentUsername,
        )
      : false;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private recipeService: RecipeService,
    private authService: AuthService,
  ) {
    effect(() => {
      const loggedInUser = this.loggedInUserInfo();
      const currentUsername = this.username();
      if (loggedInUser && currentUsername) {
        console.log('Effect triggered: Updating isFriend');
      }
    });
  }

  ngOnInit(): void {
    const currentUsername = this.authService.getCurrentUsername();
    if (currentUsername) {
      this.loggedInUsername.set(currentUsername);
      this.profileService.getUserProfile(currentUsername).subscribe({
        next: (data) => {
          this.loggedInUserInfo.set(data);
          this.route.paramMap.subscribe((params) => {
            this.username.set(params.get('username'));
            if (this.username()) {
              this.loadUserProfile(this.username()!);
            }
          });
          console.log('Logged-in user profile loaded successfully');
        },
        error: (err) => {
          console.error('Error loading logged-in user profile: ', err);
        },
      });
    } else {
      throw new Error('No current username found');
    }
  }

  loadUserProfile(username: string): void {
    this.profileService.getUserProfile(username).subscribe({
      next: (data) => {
        this.userInfo.set(data);
        this.isLoading.set(false);
        if (this.userInfo() && this.userInfo()!.dateOfBirth) {
          this.userInfo()!.dateOfBirth = this.formatDate(
            this.userInfo()!.dateOfBirth,
          );
        }
        this.loadFriendsDetails();
        this.loadLikedRecipeDetails();
        console.log('User info loaded successfully:', this.userInfo());
      },
      error: (err) => {
        console.error('Error loading user profile', err);
        this.isLoading.set(false);
      },
    });
  }

  loadFriendsDetails(): void {
    if (this.userInfo() && this.userInfo()!.friends) {
      this.userInfo()!.friends.forEach((friend) => {
        this.profileService.getUserProfile(friend.username).subscribe({
          next: (data) => {
            this.friendDetails.update((details) => {
              details[friend.username] = data;
              return details;
            });
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
    if (this.userInfo() && this.userInfo()!.likedRecipes) {
      this.userInfo()!.likedRecipes.forEach((recipe) => {
        console.log('Loading recipe with ID:', recipe.recipeId);
        this.recipeService.getRecipeById(recipe.recipeId).subscribe({
          next: (data) => {
            this.likedRecipeDetails.update((details) => {
              details[recipe.recipeId] = data;
              return details;
            });
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

  addFriend(): void {
    if (this.userInfo() && this.loggedInUsername()) {
      const updatedLoggedUserInfo = Object.assign({}, this.loggedInUserInfo());
      const updatedUserInfo = Object.assign({}, this.userInfo());

      const userFriend: Friend = { username: this.userInfo()!.username };
      const loggedFriend: Friend = { username: this.loggedInUsername() };

      updatedLoggedUserInfo.friends.push(userFriend);
      updatedUserInfo.friends.push(loggedFriend);

      // Save the previous state
      const backupLoggedUserInfo = this.loggedInUserInfo();
      const backupUserInfo = this.userInfo();

      this.loggedInUserInfo.set(updatedLoggedUserInfo);
      this.userInfo.set(updatedUserInfo);

      const friendship: Friendship = {
        username: this.loggedInUsername(),
        friendUsername: this.userInfo()!.username,
      };
      this.profileService.addFriend(friendship).subscribe({
        next: (data) => {
          console.log('Friend added successfully:', data);
        },
        error: (err) => {
          console.error('Error adding friend', err);
          // Rollback changes in case of error
          this.loggedInUserInfo.set(backupLoggedUserInfo);
          this.userInfo.set(backupUserInfo);
        },
      });
    }
  }

  removeFriend(): void {
    if (this.userInfo() && this.loggedInUsername()) {
      const updatedLoggedUserInfo = Object.assign({}, this.loggedInUserInfo());
      const updatedUserInfo = Object.assign({}, this.userInfo());

      updatedLoggedUserInfo.friends = updatedLoggedUserInfo.friends.filter(
        (friend) => friend.username !== this.userInfo()!.username,
      );

      updatedUserInfo.friends = updatedUserInfo.friends.filter(
        (friend) => friend.username !== this.loggedInUsername(),
      );

      // Save the previous state
      const backupLoggedUserInfo = this.loggedInUserInfo();
      const backupUserInfo = this.userInfo();

      this.loggedInUserInfo.set(updatedLoggedUserInfo);
      this.userInfo.set(updatedUserInfo);

      const friendship: Friendship = {
        username: this.loggedInUsername(),
        friendUsername: this.userInfo()!.username,
      };

      this.profileService.removeFriend(friendship).subscribe({
        next: (data) => {
          console.log('Friend removed successfully:', data);
        },
        error: (err) => {
          console.error('Error removing friend', err);
          // Rollback changes in case of error
          this.loggedInUserInfo.set(backupLoggedUserInfo);
          this.userInfo.set(backupUserInfo);
        },
      });
    }
  }
}
