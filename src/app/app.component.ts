import { Component, ViewChild, Renderer } from '@angular/core';
import { Nav, Platform, ToastController, Events, AlertController } from 'ionic-angular';

import { GoogleAnalytics } from '@ionic-native/google-analytics';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HeaderColor } from '@ionic-native/header-color';

import Parse from 'parse';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from './app.config';

import { User } from '../providers/user-service';
import { LocalStorage } from '../providers/local-storage';
import { Preference } from '../providers/preference';
import { WindowRef } from '../providers/window-ref';
import { Installation } from '../providers/installation';
import { ImageLoaderConfig, ImgLoader } from 'ionic-image-loader';
// import { FirebaseManager } from "../helpers/firebase-manager";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';
  user: User;
  trans: any;
  private objWindow: any;

  private pages: Array<{ title: string, icon: string, component: any }>;

  constructor(public platform: Platform,
    private renderer: Renderer,
    private events: Events,
    private storage: LocalStorage,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private preference: Preference,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private googleAnalytics: GoogleAnalytics,
    private windowRef: WindowRef,
    private installationService: Installation,
    private imageLoaderConfig: ImageLoaderConfig,
    private alertCtrl: AlertController,
    private userService: User,
    private headerColor: HeaderColor) {

    this.initializeApp();
  }

  onMenuOpened() {
    this.events.publish('onMenuOpened');
  }

  onMenuClosed() {
    this.events.publish('onMenuClosed');
  }

  buildMenu() {

    let trans = ['HOME', '', 'CATEGORIES', 'MAP', 'ADD_PLACE', 'MY_FAVORITES',
      'SETTINGS', 'LOGIN', 'LOGOUT', 'LOGGED_OUT', 'PROFILE'];

    this.translate.get(trans).subscribe(values => {

      this.trans = values;

      this.pages = [
        { title: values.HOME, icon: 'home', component: 'HomePage' },
        { title: values.CATEGORIES, icon: 'pricetag', component: 'CategoriesPage' },
        { title: values.MAP, icon: 'map', component: 'MapPage' },
        { title: values.ADD_PLACE, icon: 'create', component: 'AddPlacePage' },
        // { title: values.POSTS, icon: 'notifications', component: 'PostListPage' },
        { title: values.MY_FAVORITES, icon: 'heart', component: 'FavoritesPage' },
        { title: values.SETTINGS, icon: 'settings', component: 'SettingsPage' },
      ];

      if (User.getCurrentUser()) {
        this.pages.push({ title: values.PROFILE, icon: 'contact', component: 'ProfilePage' })
        this.pages.push({ title: values.LOGOUT, icon: 'exit', component: null })
      } else {
        this.pages.push({ title: values.LOGIN, icon: 'log-in', component: 'SignInPage' })
      }

    });
  }

  initializeApp() {

    this.setupLocalStorage();
    this.setupParse();
    this.setupEvents();
    this.setupImageLoader();

    // if (FirebaseManager.getInstance()) {
    //   console.log('firebase loaded');
    // }

    this.user = User.getCurrentUser();
    this.fetchUser();

    this.platform.ready().then(() => {
      this.setupStatusBar();
      this.setupGoogleAnalytics();
      this.setupPush();
      this.setupAndroidHeaderColor();
      this.splashScreen.hide();
    });
  }

  fetchUser() {
    this.user = User.getCurrentUser();
    if (this.user) this.user.fetch();
  }

  setupImageLoader() {
    this.imageLoaderConfig.enableSpinner(false);
    this.imageLoaderConfig.setFallbackUrl('assets/img/placeholder1.png');
    this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
    this.imageLoaderConfig.setBackgroundSize('cover');
    this.imageLoaderConfig.setConcurrency(20);
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  setupLocalStorage() {

    this.translate.setDefaultLang(AppConfig.DEFAULT_LANG);

    this.storage.lang.then(val => {

      let lang: any = val || AppConfig.DEFAULT_LANG;

      this.translate.use(lang);
      this.storage.lang = lang;
      this.preference.lang = lang;

      this.storage.skipIntroPage.then((skipIntroPage) => {
        if (!skipIntroPage) this.rootPage = 'WalkthroughPage';
      }).catch((e) => console.log(e));

      this.buildMenu();
    }).catch((e) => console.log(e));

    this.storage.unit.then(val => {
      let unit = val || AppConfig.DEFAULT_UNIT;

      this.storage.unit = unit;
      this.preference.unit = unit;
    }).catch((e) => console.log(e));

  }

  setupEvents() {

    this.events.subscribe('user:login', (user) => {
      this.user = user;
      this.buildMenu();
      this.fetchUser();
      this.updateInstallation();
    });

    this.events.subscribe('user:logout', () => {
      this.onLogOut();
    });

    this.events.subscribe('lang:change', () => {
      this.buildMenu();
    });
  }

  setupParse() {
    Parse.serverURL = AppConfig.SERVER_URL;
    Parse.initialize(AppConfig.APP_ID);

    User.getInstance();
  }

  setupStatusBar() {
    if (this.platform.is('ios')) {
      this.statusBar.overlaysWebView(true);
      this.statusBar.styleDefault();
    } else {
      this.statusBar.backgroundColorByHexString(AppConfig.HEADER_COLOR);
    }
  }

  setupAndroidHeaderColor() {
    if (AppConfig.HEADER_COLOR && this.platform.is('android')) {
      this.headerColor.tint(AppConfig.HEADER_COLOR);
    }
  }

  setupGoogleAnalytics() {
    if (AppConfig.TRACKING_ID) {
      this.googleAnalytics.startTrackerWithId(AppConfig.TRACKING_ID);
      this.googleAnalytics.trackEvent('', 'App opened');
      this.googleAnalytics.debugMode();
      this.googleAnalytics.enableUncaughtExceptionReporting(true);
    }
  }

  setupPush() {

    this.objWindow = this.windowRef.nativeWindow;

    if (this.objWindow.ParsePushPlugin) {
      this.objWindow.ParsePushPlugin.on('receivePN', (pn) => {
        console.log('[receivePn] Push notification:' + JSON.stringify(pn));
      });

      this.objWindow.ParsePushPlugin.on('openPN', (pn) => {
        console.log('Notification:' + JSON.stringify(pn));
      });

      this.updateInstallation();
    }
  }

  updateInstallation() {

    if (this.objWindow.ParsePushPlugin) {

      let user = null;

      if (this.user) {
        user = {
          __type: 'Pointer',
          className: '_User',
          objectId: this.user.id
        };
      }

      this.objWindow.ParsePushPlugin.getInstallationObjectId(id => {
        this.installationService.save(id, { user: user }).subscribe(data => {
          console.log('Installation updated', data);
        }, err => console.warn(err))
      });
    }
  }

  showNotification(notification) {
    this.translate.get(['NOTIFICATION', 'OK']).subscribe(str => {
      this.showAlert(str.NOTIFICATION, notification.alert, str.OK);
    });
  }

  showAlert(title: string = '', message: string = '', okText: string = 'OK') {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [okText],
    });
    alert.present();
  }

  openPage(page) {

    if ((page.component === 'FavoritesPage' || page.component === 'AddPlacePage' || page.component === 'SignInPage') && !User.getCurrentUser()) {

      this.nav.push('SignInPage');

    } else if (page.component === null && User.getCurrentUser()) {

      this.onLogOut();

    } else {
      this.nav.setRoot(page.component);
    }
  }

  showToast(message: string = '') {

    let alert = this.toastCtrl.create({
      message: message,
      duration: 3000
    });

    alert.present();
  }

  async onLogOut() {

    try {

      await this.userService.logout();
      this.user = null;
      this.nav.setRoot('HomePage');
      this.translate.get('LOGGED_OUT').subscribe(str => this.showToast(str));
      this.buildMenu();
      this.updateInstallation();

    } catch (err) {
      console.log(err.message);
    }

  }
}
