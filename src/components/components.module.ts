import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InfoWindowComponent } from './info-window/info-window';
import { TranslateModule } from '@ngx-translate/core';
import { Ionic2RatingModule } from 'ionic2-rating';
import { IonicImageLoader } from 'ionic-image-loader';
import { StarRatingModule } from 'angular-star-rating';

@NgModule({
	declarations: [InfoWindowComponent],
	entryComponents: [InfoWindowComponent],
	imports: [
		IonicPageModule.forChild(InfoWindowComponent),
		TranslateModule,
		Ionic2RatingModule,
		IonicImageLoader,
		StarRatingModule
	],
	exports: [InfoWindowComponent]
})
export class ComponentsModule {}
