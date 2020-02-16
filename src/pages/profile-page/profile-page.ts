import { IonicPage } from 'ionic-angular';
import { Component, Injector, Renderer } from '@angular/core';
import { ModalController } from 'ionic-angular';
import { User } from '../../providers/user-service';
import { BasePage } from '../base-page/base-page';
import { Review } from '../../providers/review-service';
import { Place } from '../../providers/place-service';
// import {
//   trigger,
//   style,
//   animate,
//   transition,
//   query,
//   stagger
// } from '@angular/animations';
import { ImgLoader } from 'ionic-image-loader';

@IonicPage()
@Component({
  selector: 'page-profile-page',
  templateUrl: 'profile-page.html',
  // animations: [
  //   trigger('staggerIn', [
  //     transition('* => *', [
  //       query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
  //       query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
  //     ])
  //   ])
  // ]
})
export class ProfilePage extends BasePage {

  protected likedPlaces: Place[] = [];
  protected places: Place[] = [];
  protected reviews: Review[] = [];

  private user: User;
  public segment: string = 'likes';

  constructor(injector: Injector,
    private renderer: Renderer,
    private placeService: Place,
    private reviewService: Review,
    private modalCtrl: ModalController) {
    super(injector);
    this.user = User.getCurrentUser();
  }

  enableMenuSwipe() {
    return true;
  }

  ionViewDidLoad() {
    this.loadLikedPlaces();
    this.loadReviews();
    this.loadMyPlaces();
  }

  async loadLikedPlaces() {
    try {
      this.likedPlaces = await this.placeService.loadFavorites()
    } catch (err) {
      console.warn(err.message);
    }
  }

  async loadMyPlaces() {
    try {
      this.places = await this.placeService.load({
        user: this.user,
        status: ['Pending', 'Approved', 'Rejected']
      })
    } catch (err) {
      console.warn(err.message);
    }
  }

  async loadReviews() {
    try {
      this.reviews = await this.reviewService.load({ user: this.user })
    } catch (err) {
      console.warn(err.message);
    }
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  goToPlace(place) {
    this.navigateTo('PlaceDetailPage', { place: place });
  }

  onPresentEditModal() {
    let modal = this.modalCtrl.create('EditProfilePage', { user: this.user });
    modal.onDidDismiss(() => {
      this.user = User.getCurrentUser();
    });
    modal.present();
  }

}
