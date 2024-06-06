import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { AuthService } from './services/auth.service';

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
    this.authService.isAuthenticated().subscribe((isAuth) => {
      console.log('Initial authentication status:', isAuth);
      this.isAuthenticated = isAuth;
    });

    this.authService.authStatus.subscribe((status) => {
      console.log('Authentication status changed:', status);
      this.isAuthenticated = status;
    });
  }
}
