import { Component, Injector } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';
import swal from 'sweetalert';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage extends BasePage {

  private form: FormGroup;

  constructor (injector: Injector,
    private viewCtrl: ViewController,
    private userService: User) {
      
      super(injector);

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  enableMenuSwipe () {
    return false;
  }

  onDismiss () {
    this.viewCtrl.dismiss();
  }

  async onSubmit () {

    if (this.form.invalid) {
      const message = await this.getTrans('INVALID_FORM');
      return this.showToast(message);
    }

    try {

      await this.showLoadingView();
      
      const email = this.form.value.email;
      
      await this.userService.recoverPassword(email);

      this.showContentView();

      const trans = await this.getTrans(['GOOD_JOB','FORGOT_PASSWORD_SUCCESS'])
      swal(trans.GOOD_JOB, trans.FORGOT_PASSWORD_SUCCESS, 'success');

      this.onDismiss();

    } catch (err) {

      if (err.code === 205) {
        this.translate.get('EMAIL_NOT_FOUND').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }

      this.showContentView();

    }

  }

}
