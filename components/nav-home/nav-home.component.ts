import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { AppConfig } from 'src/conf/app.config';
import { User } from 'src/app/home-rnf/models/user.model';

@Component({
  selector: 'app-nav-home',
  templateUrl: './nav-home.component.html',
  styleUrls: ['./nav-home.component.scss']
})
export class NavHomeComponent implements OnInit {

  constructor(
    public _authService: AuthService
  ) { }

  title = AppConfig.appTitle;
  subtitle = AppConfig.appSubTitle;
  credit = AppConfig.creditHeaderImage;
  menu = AppConfig.menu;

  ngOnInit(): void {    
  }

  public get signedIn(): boolean {
    return this._authService.authenticated || false;
  }

  public get user(): null|User {
    return this._authService.getCurrentUser();
  }

}
