import { IonicPage } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { ViewController, Events } from 'ionic-angular';
import { BasePage } from '../base-page/base-page';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { User } from '../../providers/user-service';

@IonicPage()
@Component({
  selector: 'page-sign-in-page',
  templateUrl: 'sign-in-page.html'
})
export class SignInPage extends BasePage {

  private form: FormGroup;

  constructor(injector: Injector,
    private events: Events,
    private userService: User,
    /*private fb: Facebook,*/
    private viewCtrl: ViewController,
    ) {

    super(injector);

    this.form = new FormGroup({
      email: new FormControl('', Validators.pattern('[^ @]*@[^ @]*')),
      password: new FormControl('', Validators.required)
    });

    this.events.subscribe('user:login', () => {
      this.onCancel();
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

  onFacebookButtonTouched() {
    /*this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => this.loggedIntoFacebook(res))
    .catch(e => console.log('Error logging into Facebook', e));*/
  }

  /*loggedIntoFacebook(res: FacebookLoginResponse) {

    console.log('Logged into Facebook', res);

    let expirationDate = new Date();
    expirationDate.setSeconds(expirationDate.getSeconds() + res.authResponse.expiresIn);
    
    let expirationDateFormatted = expirationDate.toISOString();
 
    var facebookAuthData = {
      id: res.authResponse.userID,
      access_token: res.authResponse.accessToken,
      expiration_date: expirationDateFormatted
    };

    this.showLoadingView().then(() => {
      this.userService.loginWithFacebook({ authData: facebookAuthData })
      .then(user => this.loggedViaFacebook(user))
      .catch(e => this.loginViaFacebookFailure(e));
    });
    
  }

  loginViaFacebookFailure(error) {
    console.log('Error logging into Facebook', error);
    this.translate.get('ERROR_UNKNOWN').subscribe(str => this.showToast(str));
    this.showContentView();
  }

  loggedViaFacebook(user) {
    this.showContentView();

    const transParams = { username: user.name };
    
    this.translate.get('LOGGED_IN_AS', transParams)
      .subscribe(str => this.showToast(str));

    this.events.publish('user:login', user);
  }*/

  async onSubmit() {

    try {

      if (this.form.invalid) {
        const message = await this.getTrans('INVALID_FORM');
        return this.showToast(message);
      }

      await this.showLoadingView();
      console.log("this.form.value: ", this.form.value)
      let user = await this.userService.signIn(this.form.value);

      this.showContentView();

      const transParams = { username: user.username };
      this.translate.get('LOGGED_IN_AS', transParams)
        .subscribe(str => this.showToast(str));

      this.events.publish('user:login', user);

    } catch (err) {

      if (err.code === 101) {
        this.translate.get('INVALID_CREDENTIALS')
        .subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK')
        .subscribe(str => this.showToast(str));
      }

      this.showContentView();
    }
  }

  goToSignUp() {
    this.navigateTo('SignUpPage');
  }

}
