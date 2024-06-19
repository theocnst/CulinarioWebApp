import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreateCommentDto } from '../../../../core/models/comment.model';
import { AuthService } from '../../../../core/services/user/auth.service';
import { CommentService } from '../../../../core/services/recipe/comment.service';

@Component({
  selector: 'app-comment-add',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comment-add.component.html',
})
export class CommentAddComponent {
  @Input() recipeId!: number;
  @Output() refreshComments = new EventEmitter<void>();
  note: string = '';
  errorMessage: string | null = null;

  constructor(
    private commentService: CommentService,
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    const username = this.authService.getCurrentUsername();
    if (username && this.recipeId && this.note.trim()) {
      const newComment: CreateCommentDto = {
        username,
        recipeId: this.recipeId,
        note: this.note.trim(),
      };
      this.commentService.addComment(newComment).subscribe(
        () => {
          this.note = '';
          console.log('Comment posted successfully');
          this.refreshComments.emit();
        },
        (error) => {
          console.error('Error posting comment:', error);
          this.errorMessage = 'Error posting comment';
        },
      );
    } else {
      this.errorMessage = 'Comment cannot be empty';
    }
  }
}
