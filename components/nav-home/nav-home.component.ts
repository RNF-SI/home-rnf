import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/home-rnf/models/user.model';
import { AppConfig } from 'src/conf/app.config';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.scss']
})
export class NavHomeComponent implements OnInit {

  constructor(
    public _authService: AuthService,
    private router: Router
  ) { }

  title = AppConfig.appTitle;
  subtitle = AppConfig.appSubTitle;
  credit = AppConfig.creditHeaderImage;
  menu = AppConfig.menu;
  menucompte = AppConfig.menucompte
  isHomePage: boolean = false;

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isHomePage = this.router.url === '/';
    });
  }

  public get signedIn(): boolean {
    return this._authService.authenticated || false;
  }

  public get user(): null | User {
    return this._authService.getCurrentUser();
  }

}
