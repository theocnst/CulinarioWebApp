import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment',
  standalone: true,
  template: `
    <div class="comment flex items-start space-x-4 p-4">
      <img
        [src]="profilePicture"
        alt="Profile Picture"
        class="h-10 w-10 cursor-pointer rounded-full object-cover"
        (click)="navigateToProfile(username)"
      />
      <div>
        <div class="flex items-center space-x-2">
          <a
            (click)="navigateToProfile(username)"
            class="cursor-pointer text-blue-500 hover:underline"
            >{{ name }}</a
          >
        </div>
        <p class="text-gray-700">{{ note }}</p>
      </div>
    </div>
  `,
  styles: [
    `
      .comment {
        border-bottom: 1px solid #e2e8f0;
      }
    `,
  ],
})
export class CommentComponent {
  @Input() username!: string;
  @Input() profilePicture!: string;
  @Input() name!: string;
  @Input() note!: string;

  constructor(private router: Router) {}

  navigateToProfile(username: string): void {
    this.router.navigate(['/profile', username]);
  }
}
