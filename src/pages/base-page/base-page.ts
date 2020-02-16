import { Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NavController, LoadingController, ToastController, NavParams,
  AlertController, MenuController } from 'ionic-angular';

export abstract class BasePage {

  public isErrorViewVisible: boolean;
  public isEmptyViewVisible: boolean;
  public isContentViewVisible: boolean;
  public isLoadingViewVisible: boolean;

  protected refresher: any;
  protected infiniteScroll: any;
  protected navParams: NavParams;
  protected translate: TranslateService;

  private loader: any;
  private navCtrl: NavController;
  private toastCtrl: ToastController;
  private loadingCtrl: LoadingController;
  private alertCtrl: AlertController;

  constructor(injector: Injector) {
    this.loadingCtrl = injector.get(LoadingController);
    this.toastCtrl = injector.get(ToastController);
    this.navCtrl = injector.get(NavController);
    this.alertCtrl = injector.get(AlertController);
    this.navParams = injector.get(NavParams);
    this.translate = injector.get(TranslateService);

    let menu = injector.get(MenuController);
    menu.swipeEnable(this.enableMenuSwipe());
  }

  abstract enableMenuSwipe(): boolean;

  showLoadingView() {

    this.isErrorViewVisible = false;
    this.isEmptyViewVisible = false;
    this.isContentViewVisible = false;
    this.isLoadingViewVisible = true;

    return new Promise((resolve) => {
      this.translate.get('LOADING').subscribe((loadingText: string) => {

        this.loader = this.loadingCtrl.create({
          content: `<p class="bold">${loadingText}</p>`
        });
        this.loader.present();
        resolve();
      });
    });
  }

  dismissLoadingView() {
    if (this.loader) {
      this.loader.dismiss().catch((e) => console.log('ERROR CATCH: LoadingController dismiss', e));
    }
  }

  showContentView() {

    this.isErrorViewVisible = false;
    this.isEmptyViewVisible = false;
    this.isLoadingViewVisible = false;
    this.isContentViewVisible = true;

    this.dismissLoadingView();
  }

  showEmptyView() {

    this.isErrorViewVisible = false;
    this.isLoadingViewVisible = false;
    this.isContentViewVisible = false;
    this.isEmptyViewVisible = true;

    this.dismissLoadingView();
  }

  showErrorView() {

    this.isLoadingViewVisible = false;
    this.isContentViewVisible = false;
    this.isEmptyViewVisible = false;
    this.isErrorViewVisible = true;

    this.dismissLoadingView();
  }

  onRefreshComplete(data = null) {

    if (this.refresher) {
      this.refresher.complete()
    }

    if (this.infiniteScroll) {
      this.infiniteScroll.complete();

      if (data && data.length === 0) {
        this.infiniteScroll.enable(false);
      } else {
        this.infiniteScroll.enable(true);
      }
    }
  }

  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });

    toast.present();
  }

  showConfirm(message: string): Promise<boolean> {

    return new Promise((resolve, reject) => {

      this.translate.get(['OK', 'CANCEL']).subscribe(values => {

        let confirm = this.alertCtrl.create({
          title: '',
          message: message,
          buttons: [{
            text: values.CANCEL,
            handler: () => {
              reject();
            }
          }, {
            text: values.OK,
            handler: () => {
              resolve(true);
            }
          }]
        });

        confirm.present();
      });
    });
  }

  navigateTo(page: any, params: any = {}) {
    this.navCtrl.push(page, params);
  }

  goBack() {
    this.navCtrl.pop();
  }

  getTrans(key: string | string[]) {
    return this.translate.get(key).toPromise();
  }

}
