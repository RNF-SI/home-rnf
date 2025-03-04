import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginComponent } from '../components/login/login.component';
import { AuthService } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.authService.authenticated) {
      // Si l'utilisateur est déjà authentifié, on retourne true directement.
      return of(true);
    }

    // Sinon, on ouvre le dialogue de login
    const dialogRef = this.dialog.open(LoginComponent, {
      data: { returnUrl: state.url },
      disableClose: true // Pour forcer l'utilisateur à se connecter
    });

    // Le guard renvoie un Observable qui attend que le dialogue se ferme.
    return dialogRef.afterClosed().pipe(
      map(result => {
        if (result) {
          // Si le dialogue retourne un résultat (login réussi), on retourne true.
          return true;
        } else {
          // Sinon, on retourne false (accès refusé).
          return false;
        }
      })
    );
  }
}
