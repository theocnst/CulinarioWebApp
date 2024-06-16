import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CommentDto,
  CreateCommentDto,
  DeleteCommentDto,
} from '../models/comment.model';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
  ) {
    this.apiUrl = this.configService.getConfig().apiUrl + '/Comment';
  }

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
