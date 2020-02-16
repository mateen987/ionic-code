import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PostListPage } from './post-list-page';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    PostListPage,
  ],
  imports: [
    IonicPageModule.forChild(PostListPage),
    SharedModule
  ],
  exports: [
    PostListPage
  ]
})
export class PostListPageModule {}
