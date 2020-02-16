import { IonicPage } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { ViewController, Events } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';
//import { User } from "../../models/user";
//import { AuthProvider } from "../../providers/auth";

@IonicPage()
@Component({
  selector: 'page-sign-up-page',
  templateUrl: 'sign-up-page.html'
})
export class SignUpPage extends BasePage {

  private form: FormGroup;

  constructor(injector: Injector,
    private events: Events,
    private userService: User,
    private viewCtrl: ViewController,
    ) {

    super(injector);

    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', Validators.pattern('[^ @]*@[^ @]*')),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewDidLoad() {
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }

  isFieldValid(formControl: FormControl) {
    return formControl.valid;
  }

  async onSubmit() {

    if (this.form.invalid) {
      const message = await this.getTrans('INVALID_FORM');
      return this.showToast(message);
    }

    const formData = Object.assign({}, this.form.value);

    if (formData.password !== formData.confirmPassword) {
      const message = await this.getTrans('PASSWORD_DOES_NOT_MATCH');
      return this.showToast(message);
    }

    if (formData.email === '') {
      delete formData.email;
    }

    delete formData.confirmPassword;

    try {

      await this.showLoadingView();
      
      let user = await this.userService.create(formData);

      this.showContentView();

      const transParams = { username: user.username };
      this.translate.get('LOGGED_IN_AS', transParams).subscribe(str => this.showToast(str));

      this.events.publish('user:login', user);
      this.onCancel();

    } catch (err) {

      this.showContentView();

      if (err.code === 202) {
        this.translate.get('USERNAME_TAKEN').subscribe(str => this.showToast(str));
      } else if (err.code === 203) {
        this.translate.get('EMAIL_TAKEN').subscribe(str => this.showToast(str));
      } else if (err.code === 125) {
        this.translate.get('EMAIL_INVALID').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }

    }

  }

}
