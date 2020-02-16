import { Component, Injector, Renderer } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { BasePage } from '../base-page/base-page';
import { Post } from '../../providers/post';
import { ImgLoader } from 'ionic-image-loader';
// import {
//   trigger,
//   style,
//   animate,
//   transition,
//   query,
//   stagger
// } from '@angular/animations';
import { Place } from '../../providers/place-service';

@IonicPage()
@Component({
  selector: 'page-post-list-page',
  templateUrl: 'post-list-page.html',
  // animations: [
  //   trigger('staggerIn', [
  //     transition('* => *', [
  //       query(':enter', style({ opacity: 0, transform: `translate3d(0,10px,0)` }), { optional: true }),
  //       query(':enter', stagger('100ms', [animate('300ms', style({ opacity: 1, transform: `translate3d(0,0,0)` }))]), { optional: true })
  //     ])
  //   ])
  // ]
})
export class PostListPage extends BasePage {

  private posts: Post[] = [];
  private params: any = {};

  constructor(injector: Injector,
    private renderer: Renderer,
    private postService: Post) {
    super(injector);
    this.params.limit = 20;
    this.params.page = 0;
  }

  enableMenuSwipe(): boolean {
    return false;
  }

  ionViewDidLoad() {
    this.showLoadingView();
    this.loadData();
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  async loadData(refresher = null) {

    this.refresher = refresher;

    try {

      const posts = await this.postService.load(this.params);

      for (let post of posts) {
        this.posts.push(post)
      }

      if (this.posts.length) {
        this.showContentView();
      } else {
        this.showEmptyView();
      }

      this.onRefreshComplete(posts);

    } catch (err) {
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      this.showContentView();
      this.onRefreshComplete();
    }
  }

  onLoadMore(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.params.page++;
    this.loadData();
  }

  goToPlace(place: Place) {
    this.navigateTo('PlaceDetailPage', {
      place: place
    });
  }

}
