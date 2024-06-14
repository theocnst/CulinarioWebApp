import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-comment',
  standalone: true,
  templateUrl: './comment.component.html',
})
export class CommentComponent implements OnInit {
  @Input() username!: string;
  @Input() profilePicture!: string;
  @Input() name!: string;
  @Input() note!: string;
  @Input() recipeId!: number;
  @Output() refreshComments = new EventEmitter<void>();

  currentUsername: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    this.currentUsername = this.authService.getCurrentUsername();
  }

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }

  deleteComment(): void {
    if (this.username && this.recipeId) {
      this.commentService
        .deleteComment({ username: this.username, recipeId: this.recipeId })
        .subscribe(
          () => {
            console.log('Comment deleted successfully');
            this.refreshComments.emit();
          },
          (error) => {
            console.error('Error deleting comment:', error);
          },
        );
    }
  }
}
