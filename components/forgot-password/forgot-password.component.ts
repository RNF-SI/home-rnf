import { Component } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth-service.service';
import { RedirectService } from '../../services/redirect.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  formNoPwd: UntypedFormGroup;
  private email: UntypedFormControl;
  public disableSubmit = false;


  constructor(
    public _authService: AuthService,
    private redirect: RedirectService,
    private _toasterService: ToastrService,
    private router: Router
  ) {
    this.email = new UntypedFormControl(null, [Validators.required, Validators.email]);

    this.formNoPwd = new UntypedFormGroup({});

    this.formNoPwd.addControl('email', this.email)
  }
  resetPwdRequest() {
    // this.disableSubmit = true;
    this.formNoPwd.value['email'] = this.formNoPwd.value['email'].toLowerCase();

    this._authService.loginOrPwdRecovery(this.formNoPwd.value)
      .subscribe(() => {
        this._toasterService.info('Vous recevrez un mail avec un lien pour réinitialiser votre mot de passe.', 'Réinitialisation du mot de passe demandée !')
        this.router.navigate(['/']);
      }, error => {
        this._toasterService.error(error.error.msg, '')
      })
      .add(() => {
        this.disableSubmit = false;
      })

  }
}
