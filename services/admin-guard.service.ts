import { inject, Injectable } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth-service.service';

@Injectable({ providedIn: 'root' })
export class AdminGuardService {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const me = this.auth.getMeSnapshot();
    if (me && (me.profile.is_super_admin || me.is_app_admin)) {
      return true;
    }
    return this.router.parseUrl('/');
  }
}

export const AdminGuard: CanActivateFn = () => inject(AdminGuardService).canActivate();
