import { IonicPage } from 'ionic-angular';
import { Component, Injector, Renderer } from '@angular/core';
import { Events } from 'ionic-angular';
import { Category } from '../../providers/categories';
import { BasePage } from '../base-page/base-page';
import { User } from '../../providers/user-service';
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
  selector: 'page-categories',
  templateUrl: 'categories.html',
  // animations: [
  //   trigger('staggerIn', [
  //     transition('* => *', [
  //       query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
  //       query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
  //     ])
  //   ])
  // ]
})
export class CategoriesPage extends BasePage {

  private categories: Category[] = [];

  constructor(injector: Injector,
    private events: Events,
    private renderer: Renderer,
    private categoryService: Category) {
    super(injector);
  }

  enableMenuSwipe() {
    return true;
  }

  ionViewDidLoad() {
    this.showLoadingView();
    this.loadData();
  }

  goToPlaces(category: Category) {
    this.navigateTo('PlacesPage', { category: category });
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  async loadData() {

    try {

      this.categories = await this.categoryService.load();

      if (this.categories.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete();

    } catch (error) {
      if (error.code === 209) {
        User.logOut().then(
          () => this.events.publish('user:logout')),
          err => console.log(err);
      }

      this.showErrorView();
      this.onRefreshComplete();
    }
  }

  onReload(refresher) {
    this.refresher = refresher;
    this.loadData();
  }

}
