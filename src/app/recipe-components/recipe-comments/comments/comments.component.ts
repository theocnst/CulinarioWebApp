import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { CommentDto } from '../../../models/comment.model';

import { CommentComponent } from '../comment/comment.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommentComponent],
  template: `
    <div class="comments">
      <h2 class="mb-2 text-center text-xl font-semibold">Comments</h2>
      @if (comments.length === 0) {
        <div class="text-center text-gray-600">
          No comments yet.
        </div>
      }
      @for (comment of comments; track comment) {
        <div>
          <app-comment
            [username]="comment.username"
            [profilePicture]="comment.profilePicture"
            [name]="comment.name"
            [note]="comment.note"
          ></app-comment>
        </div>
      }
    </div>
    `,
  styles: [
    `
      .comments {
        border-top: 1px solid #e2e8f0;
        padding-top: 1rem;
      }
    `,
  ],
})
export class CommentsComponent implements OnInit {
  @Input() recipeId!: number;
  comments: CommentDto[] = [];

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    if (this.recipeId) {
      this.commentService.getComments(this.recipeId).subscribe(
        (comments) => {
          this.comments = comments;
        },
        (error) => {
          console.error('Error fetching comments:', error);
        },
      );
    }
  }
}
