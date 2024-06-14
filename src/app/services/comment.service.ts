import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommentDto,
  CreateCommentDto,
  DeleteCommentDto,
} from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'https://localhost:7053/api/Comment';

  constructor(private http: HttpClient) {}

  getComments(recipeId: number): Observable<CommentDto[]> {
    return this.http.get<CommentDto[]>(`${this.apiUrl}/${recipeId}`);
  }

  addComment(comment: CreateCommentDto): Observable<CommentDto> {
    return this.http.post<CommentDto>(this.apiUrl, comment);
  }

  deleteComment(comment: DeleteCommentDto): Observable<void> {
    return this.http.request<void>('delete', this.apiUrl, { body: comment });
  }
}
