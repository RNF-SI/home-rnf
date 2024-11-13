import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppConfig } from 'src/conf/app.config';
import { environment } from 'src/environments/environment';

import { userRnsObj } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: null = null;
  loginError: boolean = false;
  public isLoading = false;

  constructor(
    private _http: HttpClient
  ) { }

  setCurrentUser(user: any, token: any, expireDate: any, rns: any) {
    localStorage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem("tk_id_token", token)
    localStorage.setItem('expires_at', expireDate);
    localStorage.setItem('rnsUser', JSON.stringify(rns))
  }


  getCurrentUser() {
    let currentUser = localStorage.getItem('current_user');
    let user;
    if (currentUser) {
      user = JSON.parse(currentUser);
    } else {
      user = null
    }
    return user;
  }

  getRnsUser() {
    let currentRnsUser = localStorage.getItem('rnsUser');
    let rnsUser;
    if (currentRnsUser) {
      rnsUser = JSON.parse(currentRnsUser);
    } else {
      rnsUser = null
    }
    return rnsUser;
  }

  public get authenticated(): boolean {

    if (this.getCurrentUser() != null) {
      return true
    } else {
      return false;
    }
  }

  signinUser(identifiant: string, password: string): Observable<any> {
    this.isLoading = true;

    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Access-Control-Allow-Origin', '*');

    const options = {
      login: identifiant,
      password: password,
      id_application: AppConfig.ID_APPLICATION_GEONATURE
    };

    const httpOptions = {
      withCredentials: true
    };

    this._http.post<any>(`${environment.apiGeoNature}/auth/login`, options, httpOptions).subscribe(response => {
      const token = response.token;
    });

    return this._http.post<any>(`${environment.apiGeoNature}/auth/login`, options, httpOptions).pipe(
      map(
        (response) => {
          this.getRnsByUser(response.user.id_role).subscribe(res => {
            this.setCurrentUser(response.user, response.token, response.expires, res.items);
          })

        }

      )
    )
  }

  loginOrPwdRecovery(data: any): Observable<any> {
    return this._http.post<any>(`${environment.apiGeoNature}/login/recovery`, data);
  }

  logout() {
    this.cleanLocalStorage();
  }

  private cleanLocalStorage() {
    // Remove only local storage items need to clear when user logout
    localStorage.removeItem('current_user');
    // localStorage.removeItem('modules');
  }

  getRnsByUser(id_role: number): Observable<userRnsObj> {
    return this._http.get<userRnsObj>(`${environment.apiGeoNature}/exports/api/3?token=${environment.token}&role_id=${id_role}`);
  }
}
