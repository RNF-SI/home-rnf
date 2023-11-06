import { Component, Inject } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { AppConfig } from '../../../../conf/app.config';
import { AuthService } from '../../services/auth-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { RedirectService } from '../../services/redirect.service'; 
import { ToastrService } from 'ngx-toastr';

export interface LoginData {
  code?: string;
  url?: string;
};

@Component({
  selector: 'pnx-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  enable_sign_up: boolean = false;
  enable_user_management: boolean = false;
  public disableSubmit = false;

  readonly form: UntypedFormGroup;
  private identifiant: UntypedFormControl;
  private password: UntypedFormControl;

  formNoPwd : UntypedFormGroup;
  private email: UntypedFormControl;

  public errorCode: string|null = null;
  public APP_NAME = AppConfig.appName;
  public showPassword = false;
  public progress = false;

  login_or_pass_recovery: boolean = false;



  constructor(
    @Inject(MAT_DIALOG_DATA) private data: LoginData,
    public _authService: AuthService,
    private ref: MatDialogRef<LoginComponent>,
    private redirect: RedirectService,
    private _toasterService: ToastrService
  ) {

    this.identifiant = new UntypedFormControl(null, Validators.required);
    this.password = new UntypedFormControl(null, Validators.required);

    this.form = new UntypedFormGroup({});

    this.email = new UntypedFormControl(null, [Validators.required, Validators.email]);

    this.formNoPwd = new UntypedFormGroup({});

    this.formNoPwd.addControl('email', this.email)

    this.showPassword = this.progress = false;
    this.errorCode = null;

    // Removes all the controls from the form group
    Object.keys(this.form.controls).forEach( control => {
      this.form.removeControl(control);
    });

    this.form.addControl('identifiant', this.identifiant);
    this.form.addControl('password', this.password);

    // Navigates towards the data url on closing provided the user is logged in
    this.ref.beforeClosed().subscribe( user => (user && this.navigate(data.url)) );
  }

  async signIn() {

    this.progress = true;
    this._authService.signinUser(this.identifiant.value, this.password.value)
    .subscribe({
      next: (user) => {
        this.ref.close(user);
      },
      error: (error) => {
        this.showError(error)
      },
      complete: () => { }
    })

  }

  resetPwdRequest() {
    // this.disableSubmit = true;
    this.formNoPwd.value['email'] = this.formNoPwd.value['email'].toLowerCase();
    
    this._authService.loginOrPwdRecovery(this.formNoPwd.value)
    .subscribe(()=> {
      this._toasterService.info('Vous recevrez un mail avec un lien pour réinitialiser votre mot de passe.','Réinitialisation du mot de passe demandée !')
    }, error => {
      this._toasterService.error(error.error.msg, '')
    })
    .add(() => {
      this.disableSubmit = false;
    })
    
  }

  /**
   * Shows the error message
   * @param error code of the error
   */
  private showError(error: HttpErrorResponse) {
    // Stops the progress, if any
    this.progress = false;
    // Sets the error code to be displayed
    this.errorCode = error.error['type'];
    // Makes sure to turn off the error message after 10s
    setTimeout(() => this.errorCode = null, 10000);
  }

  // Navigation helper
  private navigate(to?: string) {
    // Resolves to true when no target is specified
    if(!to) { return Promise.resolve(true); }
    // Navigates as requested
    return this.redirect.navigate(to);
  }
}
