import { Component, inject, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { Subscription } from 'rxjs';
import { ReCaptchaV3Service, RecaptchaFormsModule, RecaptchaV3Module } from "ng-recaptcha-2";
import { ToastrService } from 'ngx-toastr';
import { Mail } from '../../models/mail.model';
import { MailService } from '../../services/mail.service';

@Component({
    selector: 'app-contact-home-rnf',
    templateUrl: './contact.home.rnf.component.html',
    styleUrls: ['./contact.home.rnf.component.css'],
    imports:[
      ReactiveFormsModule,
      MatFormFieldModule,
      MatButtonModule,
      MatInputModule,
      CommonModule,
      MatError,
      RecaptchaV3Module,
      RecaptchaFormsModule
    ],
    
})
export class ContactHomeRnfComponent implements OnDestroy{
  
  private _location = inject(Location);
  fb = inject(FormBuilder);
  formGroup = this.fb.group({
    nom: ['', [Validators.required]],
    expediteur: ['',[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    objet: ['', [Validators.required]],
    message: ['', [Validators.required]],
    token: [''],
    
  });
  private mailService = inject(MailService);
  private mailSub ?:Subscription;
  captchaToken: string | null = null;
  private recaptchaService = inject(ReCaptchaV3Service);
  public log: string[] = [];
  public declarativeFormCaptchaValue ?: string;
  private toaster = inject(ToastrService);

  recordMail(event : Event){
    event.preventDefault();

    if (this.formGroup.valid){
      this.recaptchaService.execute('contact_form').subscribe(token => {
        this.captchaToken = token;
       
        if (this.captchaToken) {
          
          const mail = Object.assign(new Mail(), this.formGroup.value);
          mail.token = token;
          this.mailSub = this.mailService.sendMail(mail).subscribe(
            reponse=>{
              this.toaster.info(reponse.message);
            }
          );
        }
      });

    }
  }

  backClicked(){
    this._location.back();
  }

  ngOnDestroy(): void {
    this.mailSub?.unsubscribe();
  }
}
