import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { MeResponse } from 'src/app/services/api.service';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class RnAuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.authService.restoreSession().pipe(
      switchMap((ok) => {
        if (!ok) {
          this.authService.beginKeycloakLogin(state.url);
          return of(false);
        }

        const rnId = route.paramMap.get('id_rn');
        if (!rnId) {
          return of(true);
        }

        const snapshot = this.authService.getMeSnapshot();
        if (this.hasReserveAccess(snapshot, rnId)) {
          return of(true);
        }

        return this.authService.refreshMeFromApi().pipe(
          map((me) => {
            const allowed = this.hasReserveAccess(me, rnId);
            if (!allowed) {
              this.router.navigate(['non-autorise']);
            }
            return allowed;
          }),
          catchError(() => {
            this.router.navigate(['non-autorise']);
            return of(false);
          })
        );
      }),
      catchError(() => {
        this.router.navigate(['non-autorise']);
        return of(false);
      })
    );
  }

  private hasReserveAccess(me: MeResponse | null, rnId: string): boolean {
    if (!me) {
      return false;
    }
    if (me.profile?.is_super_admin) {
      return true;
    }
    return (me.reserves || []).some((reserve) => reserve.area_code === rnId);
  }
}
