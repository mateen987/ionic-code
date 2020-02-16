import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyViewModule } from './components/empty-view/empty-view.module';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonicImageLoader } from 'ionic-image-loader';
import { ComponentsModule } from './components/components.module';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
  declarations: [
  ],
  imports: [
    IonicModule,
    TranslateModule,
    EmptyViewModule,
    ImgFallbackModule,
    LazyLoadImageModule,
    Ionic2RatingModule,
    IonicImageLoader,
    ComponentsModule,
    StarRatingModule,
  ],
  exports: [
    TranslateModule,
    EmptyViewModule,
    ImgFallbackModule,
    LazyLoadImageModule,
    Ionic2RatingModule,
    IonicImageLoader,
    ComponentsModule,
    StarRatingModule,
  ]
})
export class SharedModule {}
