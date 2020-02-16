import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { Category } from '../providers/categories';
import { Place } from '../providers/place-service';
import { Review } from '../providers/review-service';
import { ParseFile } from '../providers/parse-file-service';
import { User } from '../providers/user-service';
import { Slide } from '../providers/slide';
import { Post } from '../providers/post';

import { LocalStorage } from '../providers/local-storage';
import { Preference } from '../providers/preference';
import { MapStyle } from '../providers/map-style';
import { Installation} from '../providers/installation';
import { WindowRef} from '../providers/window-ref';
import { AuthProvider } from '../providers/auth';
import { ApiProvider } from '../providers/api';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';
import { Geolocation } from '@ionic-native/geolocation';
import { File } from '@ionic-native/file';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import { CallNumber } from '@ionic-native/call-number';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AppVersion } from '@ionic-native/app-version';
import { HeaderColor } from '@ionic-native/header-color';
import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { AdMobFree } from '@ionic-native/admob-free';
import { BrowserTab } from '@ionic-native/browser-tab';
import { Facebook } from '@ionic-native/facebook';

import { IonicStorageModule } from '@ionic/storage';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { IonicImageLoader } from 'ionic-image-loader';
import { StarRatingModule } from 'angular-star-rating';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ImgFallbackModule,
    LazyLoadImageModule,
    HttpClientModule,
    StarRatingModule.forRoot(),
    IonicImageLoader.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    Category,
    Place,
    ParseFile,
    Review,
    LocalStorage,
    User,
    Slide,
    Post,
    Installation,
    WindowRef,
    StatusBar,
    SplashScreen,
    Geolocation,
    LaunchNavigator,
    CallNumber,
    InAppBrowser,
    SocialSharing,
    GoogleMaps,
    Camera,
    GoogleAnalytics,
    AdMobFree,
    AppVersion,
    HeaderColor,
    BrowserTab,
    Facebook,
    AuthProvider,
    ApiProvider,
    File,
    Preference, MapStyle, { provide: ErrorHandler, useClass: IonicErrorHandler }]
})
export class AppModule {}
