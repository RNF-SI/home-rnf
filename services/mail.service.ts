import { Observable, map } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IMail } from '../interfaces/mail.interface';
import { Mail } from '../models/mail.model';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  private BASE_URL = environment.flask_server+'contact-home-rnf';
  private http = inject(HttpClient);

  //Récupère les mails en fonction des sites
  sendMail(mail:Mail):Observable<Mail>{
    return this.http.post<IMail>(this.BASE_URL + '/send', mail.toJson()).pipe(
        map(mailJson => Mail.fromJson(mailJson))
      );
  }

  
}