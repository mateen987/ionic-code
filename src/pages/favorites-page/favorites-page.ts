import { IonicPage } from 'ionic-angular';
import { Component, Injector, Renderer } from '@angular/core';
import { Place } from '../../providers/place-service';
import { BasePage } from '../base-page/base-page';
import { ImgLoader } from 'ionic-image-loader';
// import {
//   trigger,
//   style,
//   animate,
//   transition,
//   query,
//   stagger
// } from '@angular/animations';

@IonicPage()
@Component({
  selector: 'page-favorites-page',
  templateUrl: 'favorites-page.html',
  // animations: [
  //   trigger('staggerIn', [
  //     transition('* => *', [
  //       query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
  //       query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
  //     ])
  //   ])
  // ]
})
export class FavoritesPage extends BasePage {

  private params: any = {};
  private places: Place[] = [];

  constructor(injector: Injector,
    private renderer: Renderer,
    private placeService: Place) {
    super(injector);

    this.showLoadingView();
    this.onReload();
  }

  enableMenuSwipe() {
    return true;
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  goToPlace(place) {
    this.navigateTo('PlaceDetailPage', { place: place });
  }

  loadData() {

    this.placeService.loadFavorites(this.params).then(places => {

      for (let place of places) {
        this.places.push(place);
      }

      this.onRefreshComplete(places);

      if (this.places.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

    }, () => {
      this.onRefreshComplete();
    });
  }

  onLoadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.params.page++;
    this.loadData();
  }

  onReload(refresher = null) {
    this.refresher = refresher;
    this.places = [];
    this.params.page = 0;
    this.loadData();
  }

}
