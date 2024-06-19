export interface CommentDto {
  username: string;
  recipeId: number;
  note: string;
  profilePicture: string;
  name: string;
}

export interface CreateCommentDto {
  username: string;
  recipeId: number;
  note: string;
}

export interface DeleteCommentDto {
  username: string;
  recipeId: number;
}
