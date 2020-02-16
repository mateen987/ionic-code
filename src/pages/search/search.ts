import { Component, Injector, Renderer } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../base-page/base-page';
import { Place } from '../../providers/place-service';
import { ImgLoader } from 'ionic-image-loader';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage extends BasePage {

  private params: any = {
    limit: 100
  };

  private searchoption: String = "rating" ;

  private places: Place[] = [];

  constructor(injector: Injector,
    private renderer: Renderer,
    private placeService: Place) {
    super(injector);
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ionViewDidLoad() {
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);  
  }

  async loadData(refresher = null) {

    this.refresher = refresher;

    try {

      const places = await this.placeService.load(this.params);

      for (let place of places) {
        this.places.push(place);
      }
  
      if (this.places.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete(this.places);

    } catch (err) {
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      this.showContentView();
      this.onRefreshComplete();
    }
  }

  onSearch(e) {
    if(this.searchoption == "rating")
      this.params.rating = e.target.value;
    if(this.searchoption == "grocery")
      this.params.rating = 1;
    if(this.searchoption == "restaurant")
      this.params.rating = 2;
    this.params.canonical = e.target.value;
    console.log("target option", this.searchoption);
    if (this.params.canonical && this.params.canonical.trim() !== '') {
      this.params.canonical = this.params.canonical.toLowerCase();
      this.showLoadingView();
      this.loadData();
    }
  }

  goToItemPage(place: Place) {
    this.navigateTo('PlaceDetailPage', {
      place: place
    });
  }

}
