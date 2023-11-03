import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AppConfig } from 'src/conf/app.config';
import { environment } from 'src/environments/environment';

import { User } from '../models/user.model';

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

  setCurrentUser(user : any, token : any, expireDate : any) {
    localStorage.setItem('current_user', JSON.stringify(user));    
    localStorage.setItem("tk_id_token", token)
    localStorage.setItem('expires_at', expireDate);
  }


  getCurrentUser() {
    let currentUser = localStorage.getItem('current_user');
    let user;
    if(currentUser){      
      user = JSON.parse(currentUser);
    } else {
      user = null
    }
    return user;
  }

  public get authenticated(): boolean {
    
    if(this.getCurrentUser()!=null){
      return true
    } else {
      return false;
    }
  }

  signinUser(identifiant: string, password: string): Observable<any> {
    this.isLoading = true;

    const headers= new HttpHeaders()
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

    this._http.post<any>(`${environment.apiUrl}/auth/login`, options, httpOptions).subscribe(response => {
      const token = response.token;
    });

    return this._http.post<any>(`${environment.apiUrl}/auth/login`, options, httpOptions).pipe(
      map(
        (response) => {
          this.setCurrentUser(response.user, response.token, response.expires)
      }

        )
    )
  }

  loginOrPwdRecovery(data : any): Observable<any> {
    return this._http.post<any>(`${environment.apiUrl}/login/recovery`, data);
  }

  logout() {
    this.cleanLocalStorage();
  }

  private cleanLocalStorage() {
    // Remove only local storage items need to clear when user logout
    localStorage.removeItem('current_user');
    // localStorage.removeItem('modules');
  }
}
