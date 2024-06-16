import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register(): void {
    if (!this.validateEmail(this.email)) {
      this.errorMessage = 'Invalid email address';
      return;
    }

    if (this.name.length < 6) {
      this.errorMessage = 'Username must be at least 6 characters long';
      return;
    }

    if (!/^[a-zA-Z0-9]*$/.test(this.name)) {
      this.errorMessage =
        'Username must not contain special characters or spaces';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long';
      return;
    }

    this.authService.checkEmail(this.email).subscribe({
      next: (emailTaken) => {
        if (emailTaken) {
          this.errorMessage = 'Email is already taken';
        } else {
          this.authService.checkUsername(this.name).subscribe({
            next: (usernameTaken) => {
              if (usernameTaken) {
                this.errorMessage = 'Username is already taken';
              } else {
                this.authService
                  .register(this.name, this.email, this.password)
                  .subscribe({
                    next: () => {
                      this.router.navigate(['/recipe-list']);
                    },
                    error: () => {
                      this.errorMessage =
                        'Registration failed. Please try again.';
                    },
                  });
              }
            },
            error: () => {
              this.errorMessage = 'Registration failed. Please try again.';
            },
          });
        }
      },
      error: () => {
        this.errorMessage = 'Registration failed. Please try again.';
      },
    });
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  closeModal(): void {
    this.errorMessage = '';
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
