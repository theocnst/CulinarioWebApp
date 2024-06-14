import { Component, Input, OnInit } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { CommentDto } from '../../../models/comment.model';
import { CommonModule } from '@angular/common';
import { CommentComponent } from '../comment/comment.component';
import { CommentAddComponent } from '../comment-add/comment-add.component';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, CommentComponent, CommentAddComponent],
  template: `
    <div class="comments">
      <h2 class="mb-2 text-center text-xl font-semibold">Comments</h2>
      <div *ngIf="comments.length === 0" class="text-center text-gray-600">
        No comments yet.
      </div>
      <div *ngFor="let comment of comments">
        <app-comment
          [username]="comment.username"
          [profilePicture]="comment.profilePicture"
          [name]="comment.name"
          [note]="comment.note"
          [recipeId]="recipeId"
          (refreshComments)="loadComments()"
        ></app-comment>
      </div>
      <app-comment-add
        [recipeId]="recipeId"
        (refreshComments)="loadComments()"
      ></app-comment-add>
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
    this.loadComments();
  }

  loadComments(): void {
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
