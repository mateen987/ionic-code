import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangePasswordPage } from './change-password';
import { SharedModule } from '../../shared.module';
 
@NgModule({
  declarations: [
    ChangePasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangePasswordPage),
    SharedModule
  ],
  exports: [
    ChangePasswordPage
  ]
})
export class ChangePasswordPageModule {}
