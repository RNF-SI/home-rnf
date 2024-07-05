import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth-service.service'; // Assurez-vous que le chemin est correct
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RnAuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    if (!this.authService.authenticated) {
      this.router.navigate(['/login']); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
      return false;
    }

    const userRns = this.authService.getRnsUser();
    const rnId = route.paramMap.get('id_rn');

    if (userRns.some((rn: { rn_id: string | null; }) => rn.rn_id === rnId)) {
      return true; // Accès autorisé
    } else {
      this.router.navigate(['non-autorise']); // Rediriger vers une page d'accès refusé ou une autre page appropriée
      return false; // Accès refusé
    }
  }
}
