export interface Friend {
  username: string;
}

export interface LikedRecipe {
  recipeId: number;
}

export interface Friendship {
  username: string;
  friendUsername: string;
}

export interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  description: string;
  dateOfBirth: string;
  friends: Friend[];
  likedRecipes: LikedRecipe[];
}

export interface LikedRecipeOperation {
  recipeId: number;
  username: string;
}
