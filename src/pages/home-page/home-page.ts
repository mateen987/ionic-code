import { Component, Injector, Renderer } from '@angular/core';
import { IonicPage, Events } from 'ionic-angular';
import { BasePage } from '../base-page/base-page';
import Parse from 'parse';
import { Slide } from '../../providers/slide';
import { InAppBrowser } from '@ionic-native/in-app-browser';
// import { BrowserTab } from '@ionic-native/browser-tab';
import { ImgLoader } from 'ionic-image-loader';
import { Category } from '../../providers/categories';
import { Place } from '../../providers/place-service';
import { GeolocationOptions, Geolocation } from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-home-page',
  templateUrl: 'home-page.html',
})
export class HomePage extends BasePage {

  protected slides: Slide[] = [];

  protected featuredPlaces: Place[] = [];
  protected newPlaces: Place[] = [];
  protected randomPlaces: Place[] = [];
  protected nearbyPlaces: Place[] = [];

  protected categories: Category[] = [];

  private randomParams: any = {};

  private location: any;

  constructor(injector: Injector,
    private events: Events,
    private geolocation: Geolocation,
    private placeService: Place,
    private inAppBrowser: InAppBrowser,
    // private browserTab: BrowserTab,
    private renderer: Renderer) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return true;
  }

  ionViewDidLoad() {
    this.showLoadingView();
    this.loadData();
    this.loadNearbyPlaces();
    
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  onReload(refresher = null) {
    this.refresher = refresher;
    this.loadData();
    this.loadNearbyPlaces();
  }

  async loadData() {

    try {

      const data: any = await Parse.Cloud.run('getHomePageData');

      this.randomPlaces = data.randomPlaces;
      
      this.newPlaces = data.newPlaces;
      this.featuredPlaces = data.featuredPlaces;
  
      this.categories = data.categories;
      this.slides = data.slides;

      this.onRefreshComplete();
      this.showContentView();


    } catch (error) {

      this.showErrorView();
      this.onRefreshComplete();

      this.translate.get('ERROR_NETWORK')
        .subscribe(str => this.showToast(str));

      if (error.code === 209) {
        this.events.publish('user:logout');
      }

    }

  }

  loadMoreRandomPlaces() {

    Parse.Cloud.run('getRandomPlaces').then((places: Place[]) => {

      for (const place of places) {
        this.randomPlaces.push(place);
      }

      this.onRefreshComplete();

    }, () => {
      this.onRefreshComplete();
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
    });

  }

  async loadNearbyPlaces() {

    try {

      const options: GeolocationOptions = {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 60000
      };

      const pos = await this.geolocation.getCurrentPosition(options);
      this.location = pos.coords;

      this.nearbyPlaces = await this.placeService.load({
        location: this.location,
        limit: 10
      });

    } catch (err) {
      console.warn(err);
    }

  }

  onLoadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.randomParams.page++;
    this.loadMoreRandomPlaces();
  }

  onSlideTouched(slide: Slide) {

    if (slide.url) {
      this.openUrl(slide.url);
    } else if (slide.place) {
      this.navigateTo('PlaceDetailPage', { place: slide.place });
    } else {
      // no match...
    }
  }

  navTo(page, param) {
    this.navigateTo(page, param);
  }

  openUrl(link) {
    this.inAppBrowser.create(link, '_system');
    // this.browserTab.isAvailable().then((isAvailable: boolean) => {

    //   if (isAvailable) {
    //     this.browserTab.openUrl(link);
    //   } else {
    //     this.inAppBrowser.create(link, '_system');
    //   }

    // }).catch(e => console.log(e));
  }

}
