export interface Friend {
  username: string;
}

export interface LikedRecipe {
  name: string;
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
