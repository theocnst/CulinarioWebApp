import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/user/auth.service';
import { NavBarComponent } from './shared/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'CulinarioWebApp';
  isAuthenticated = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Check initial authentication status only once
    this.authService.isAuthenticated().subscribe((isAuth) => {
      console.log('Initial authentication status:', isAuth);
      this.isAuthenticated = isAuth;
    });

    // Subscribe to authStatus to handle further changes
    this.authService.authStatus.subscribe((isAuth) => {
      console.log('Authentication status changed:', isAuth);
      this.isAuthenticated = isAuth;
    });
  }
}
