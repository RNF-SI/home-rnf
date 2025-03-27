// auth.service.ts
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { KeycloakService } from 'keycloak-angular';

export interface KeycloakToken {
  realm_access?: { roles: string[] };
  resource_access?: {
    [clientId: string]: { roles: string[] }
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private keycloakService: KeycloakService) { }

  // Vérifie si l'utilisateur est authentifié
  public isAuthenticated(): Promise<boolean> {
    return this.keycloakService.isLoggedIn();
  }

  // Renvoie le token d'accès (JWT)
  public getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }

  // Retourne le nom d'utilisateur (s'il est défini dans le token)
  public getUsername(): string {
    return this.keycloakService.getUsername();
  }

  // Lance la procédure de login (redirige vers la page de connexion Keycloak)
  public login(): void {
    this.keycloakService.login();
    this.keycloakService.getToken().then(token => console.log(token));
  }

  // Déconnecte l'utilisateur
  public logout(): void {
    this.keycloakService.logout();
  }

  async checkUserRole(role: string): Promise<boolean> {
    const token = await this.keycloakService.getToken();
    const decodedToken: KeycloakToken = jwtDecode(token);

    // Vérifier dans les rôles du realm
    if (decodedToken.realm_access && decodedToken.realm_access.roles.includes(role)) {
      return true;
    }
    // Vérifier dans les rôles spécifiques au client 'waterwise'
    if (
      decodedToken.resource_access &&
      decodedToken.resource_access['waterwise'] &&
      decodedToken.resource_access['waterwise'].roles.includes(role)
    ) {
      return true;
    }
    return false;
  }

  debugToken(): void {
    this.keycloakService.getToken().then(token => {
      console.log('Token JWT:', token);
      try {
        const decoded = jwtDecode(token);
        console.log('Token décodé:', decoded);
      } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
      }
    }).catch(err => {
      console.error('Erreur lors de la récupération du token:', err);
    });
  }

}
