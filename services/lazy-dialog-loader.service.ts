import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class LazyDialogLoader {
  constructor(private auth: AuthService) {}

  canActivate(_next: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean {
    // Ne pas passer state.url (/login) : sinon post_login_redirect relance ce garde en boucle après OIDC.
    this.auth.beginKeycloakLogin();
    return false;
  }
}

export const LazyDialog: CanActivateFn = (next, state) => {
  return inject(LazyDialogLoader).canActivate(next, state);
};
