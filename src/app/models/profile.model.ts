export interface Friend {
  username: string;
}

export interface LikedRecipe {
  recipeId: number;
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
