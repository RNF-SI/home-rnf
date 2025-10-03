import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { NavHomeComponent } from './components/nav-home/nav-home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { InputErrorPipe } from './pipes/input-error.pipe';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha-2';
import { AlerteContactComponent } from './components/alerte-contact/alerte-contact.component';
import { ContactHomeRnfComponent } from './components/contact/contact.home.rnf.component';

@NgModule({imports: [
        LoginComponent,
        LogoutComponent,
        NavHomeComponent,
        InputErrorPipe,
        LoadingSpinnerComponent,
        ForgotPasswordComponent,
        NotFoundComponent,
        AccessDeniedComponent,
        RecaptchaV3Module,
        AlerteContactComponent,
        ContactHomeRnfComponent
      
      ], providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
        provideHttpClient(withInterceptorsFromDi()),
        { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LdVGX0rAAAAAEtvEY2NkvUBuhRJ71lQ7ZkwbNX7' }
    ] })
export class HomeRnfModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(
      fab,
      fas,
      far
    );
  }
}
