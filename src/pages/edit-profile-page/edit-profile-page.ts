import { IonicPage } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ParseFile } from '../../providers/parse-file-service';
import { ViewController, ActionSheetController } from 'ionic-angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile-page.html'
})
export class EditProfilePage extends BasePage {

  private form: FormGroup;
  private photo: any;

  constructor(injector: Injector,
    private actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private viewCtrl: ViewController) {

    super(injector);

    const user = User.getCurrentUser();

    this.form = new FormGroup({
      name: new FormControl(user.name, Validators.required),
      username: new FormControl(user.username, Validators.required),
      email: new FormControl(user.email)
    });
  }

  enableMenuSwipe() {
    return true;
  }

  ionViewDidLoad() {}

  onDismiss() {
    this.viewCtrl.dismiss();
  }

  async chooseImage(sourceType: number) {

    try {

      let options: CameraOptions = {
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 1000,
        targetHeight: 1000,
        quality: 80,
      }

      const imageData = await this.camera.getPicture(options);

      await this.showLoadingView();

      this.photo = await ParseFile.upload(imageData);

      this.showContentView();
      this.translate.get('FILE_UPLOADED').subscribe(str => this.showToast(str));

    } catch (error) {
      this.showContentView();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    }

  }

  async onUpload() {

    try {

      const trans = await this.getTrans([
        'PHOTO_LIBRARY',
        'CAMERA',
        'CANCEL',
        'CHOOSE_AN_OPTION']
      );
  
      let actionSheet = this.actionSheetCtrl.create({
        title: trans.CHOOSE_AN_OPTION,
        buttons: [{
          text: trans.PHOTO_LIBRARY,
          handler: () => {
            this.chooseImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: trans.CAMERA,
          handler: () => {
            this.chooseImage(this.camera.PictureSourceType.CAMERA);
          }
        },{
          text: trans.CANCEL,
          role: 'cancel'
        }]
      });

      actionSheet.present();
      
    } catch (error) {
      console.warn(error);
    }
  }

  async onSubmit() {

    try {

      this.showLoadingView();

      const formData = this.form.value;
      formData.photo = this.photo;

      const user = User.getCurrentUser();

      await user.save(formData);
      this.showContentView();
      this.translate.get('SAVED').subscribe(str => this.showToast(str));
      this.onDismiss();

    } catch (error) {

      if (error.code === 202) {
        this.translate.get('USERNAME_TAKEN').subscribe(str => this.showToast(str));
      } else if (error.code === 203) {
        this.translate.get('EMAIL_TAKEN').subscribe(str => this.showToast(str));
      } else if (error.code === 125) {
        this.translate.get('EMAIL_INVALID').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }

      this.showContentView();
    }
  }

}
