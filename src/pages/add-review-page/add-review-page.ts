import { IonicPage } from 'ionic-angular';
import { Component, Injector } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { Review } from '../../providers/review-service';
import { BasePage } from '../base-page/base-page';
import swal from 'sweetalert';
import { RatingChangeEvent } from 'angular-star-rating';

@IonicPage()
@Component({
  selector: 'page-add-review-page',
  templateUrl: 'add-review-page.html'
})
export class AddReviewPage extends BasePage {

  private review: any = {
    rating: 3,
    comment: ''
  };

  constructor(injector: Injector,
    private reviewService: Review,
    private viewCtrl: ViewController) {
    super(injector);
    this.review.place = this.navParams.get('place');
  }

  enableMenuSwipe() {
    return false;
  }

  ionViewDidLoad() {
  }

  onRatingChange(event: RatingChangeEvent) {
    this.review.rating = event.rating;
  }

  async onSubmit() {

    if (!this.review.rating) {
      const message = await this.getTrans('PLEASE_SELECT_A_RATING');
      this.showToast(message);
      return;
    }

    try {

      await this.showLoadingView();

      await this.reviewService.create(this.review)
      this.showContentView();
      this.onDismiss();

      const trans = await this.getTrans(['GOOD_JOB','REVIEW_ADDED']);
      swal(trans.GOOD_JOB, trans.REVIEW_ADDED, 'success');

    } catch (err) {

      this.showContentView();

      if (err.code === 5000) {
        this.translate.get('REVIEW_ALREADY_EXISTS').subscribe(str => this.showToast(str));
      } else {
        this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      }
    }
  }

  onDismiss() {
    this.viewCtrl.dismiss();
  }

}
