import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AppConfig } from 'src/conf/app.config';

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

  setCurrentUser(user : User) {
    localStorage.setItem('current_user', JSON.stringify(user));    
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

    const options = {
      login: identifiant,
      password: password
    };

    return this._http.post<any>(`${AppConfig.API_ENDPOINT}/auth/login`, options).pipe(
      map(
        (el) => {const user = new User(
          el.user.id_role,
          el.user.id_organisme,
          el.user.prenom_role,
          el.user.nom_role,
          el.user.identifiant
        );        
        this.setCurrentUser(user);
        console.log(localStorage.getItem('current_user'));}
        
        )
    )
  }

  logout() {
    this.cleanLocalStorage();
  }

  private cleanLocalStorage() {
    // Remove only local storage items need to clear when user logout
    localStorage.removeItem('current_user');
    localStorage.removeItem('modules');
  }
}
