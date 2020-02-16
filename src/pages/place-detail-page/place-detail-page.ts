import { IonicPage, Platform } from 'ionic-angular';
import { Component, Injector, Renderer } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { Place } from '../../providers/place-service';
import { Preference } from '../../providers/preference';
import { CallNumber } from '@ionic-native/call-number';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { BrowserTab } from '@ionic-native/browser-tab';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import { SocialSharing } from '@ionic-native/social-sharing';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';
import { ImgLoader } from 'ionic-image-loader';
import { Review } from '../../providers/review-service';

@IonicPage()
@Component({
  selector: 'page-place-detail-page',
  templateUrl: 'place-detail-page.html'
})
export class PlaceDetailPage extends BasePage {

  private images = [];
  private place: Place;
  protected rating: number = 0;
  protected isLiked: boolean = false;
  protected isStarred: boolean = false;
  protected location: any;
  protected unit: string;

  protected reviews: Review[] = [];

  constructor(injector: Injector,
    private renderer: Renderer,
    private platform: Platform,
    private placeService: Place,
    private modalCtrl: ModalController,
    private preference: Preference,
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    private inAppBrowser: InAppBrowser,
    // private browserTab: BrowserTab,
    private reviewService: Review,
    private launchNavigator: LaunchNavigator,
    private socialSharing: SocialSharing) {

    super(injector);

    this.place = this.navParams.get('place');
    this.unit = this.preference.unit;
    this.images = [];

    if (this.place) {

      this.rating = this.place.rating;

      this.loadLocation();

      if (User.getCurrentUser()) {
        this.checkIfIsLiked();
        this.checkIfIsStarred();
      }

      this.loadReviews();

      if (this.place.image) {
        this.images.push(this.place.image);
      }

      if (this.place.imageTwo) {
        this.images.push(this.place.imageTwo);
      }

      if (this.place.imageThree) {
        this.images.push(this.place.imageThree);
      }

      if (this.place.imageFour) {
        this.images.push(this.place.imageFour);
      }
    }
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewDidLoad() {
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  async checkIfIsLiked() {
    try {
      const isLiked = await this.placeService.isLiked(this.place)
      this.isLiked = isLiked;
    } catch (err) {
      console.warn(err.message);
    }
  }

  async checkIfIsStarred() {
    try {
      const isStarred = await this.placeService.isStarred(this.place)
      this.isStarred = isStarred;
    } catch (err) {
      console.warn(err.message);
    }
  }

  async loadLocation() {
    try {

      const options: GeolocationOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000
      };

      let pos = await this.geolocation.getCurrentPosition(options);
      this.location = pos.coords;

    } catch (err) {
      console.warn(err);
    }
  }

  async loadReviews() {
    try {

      let reviews = await this.reviewService.load({ place: this.place, limit: 5 });
      this.reviews = reviews;

    } catch (err) {
      console.warn(err.message);
    }
  }

  openSignUpModal() {
    this.navigateTo('SignInPage');
  }

  openAddReviewModal() {
    let modal = this.modalCtrl.create('AddReviewPage', { place: this.place });
    modal.present();
  }

  onLike() {

    if (User.getCurrentUser()) {
      this.isLiked = true;
      this.placeService.like(this.place);
      this.showToast('Liked');
    } else {
      this.openSignUpModal();
    }
  }

  onRate() {
    if (User.getCurrentUser()) {
      this.openAddReviewModal();
    } else {
      this.openSignUpModal();
    }
  }

  async onShare() {
    try {
      await this.socialSharing.share(this.place.title, null, null, this.place.website)
    } catch (err) {
      console.warn(err)
    }
  }

  async onCall() {

    if (!this.place.phone) return;

    try {
      await this.callNumber.callNumber(this.place.phone, true)
    } catch (err) {
      console.warn(err)
    }
  }

  openUrl() {

    if (!this.place.website) return;

    if (this.platform.is('cordova')) {
      this.inAppBrowser.create(this.place.website, '_system');
      // this.browserTab.isAvailable().then((isAvailable: boolean) => {

      //   if (isAvailable) {
      //     this.browserTab.openUrl(this.place.website);
      //   } else {
      //     this.inAppBrowser.create(this.place.website, '_system');
      //   }

      // }).catch((err) => console.warn(err));

    } else {
      this.inAppBrowser.create(this.place.website, '_system');
    }


  }

  async goToMap() {

    try {

      const googleMaps = this.launchNavigator.APP.GOOGLE_MAPS;
      const appleMaps = this.launchNavigator.APP.APPLE_MAPS;

      const isGoogleMapsAvailable = await this.launchNavigator.isAppAvailable(googleMaps);
      const isAppleMapsAvailable = await this.launchNavigator.isAppAvailable(appleMaps);

      let app = null;

      if (isGoogleMapsAvailable) {
        app = this.launchNavigator.APP.GOOGLE_MAPS;
      } else if (isAppleMapsAvailable) {
        app = this.launchNavigator.APP.APPLE_MAPS;
      } else {
        app = this.launchNavigator.APP.USER_SELECT;
      }

      const options: LaunchNavigatorOptions = {
        app: app
      };

      const destination = [
        this.place.location.latitude,
        this.place.location.longitude
      ];

      await this.launchNavigator.navigate(destination, options);

    } catch (err) {
      console.warn(err);
    }

  }

  goToReviews() {
    this.navigateTo('ReviewsPage', this.place);
  }

}
