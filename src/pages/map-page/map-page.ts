import { IonicPage } from 'ionic-angular';
import { Component, Injector, ViewChild, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { Place } from '../../providers/place-service';
import { MapStyle } from '../../providers/map-style';
import { BasePage } from '../base-page/base-page';
// import { LocalStorage } from '../../providers/local-storage';
import { Geolocation, GeolocationOptions } from '@ionic-native/geolocation';
import { AppConfig } from '../../app/app.config';
import { InfoWindowComponent } from '../../components/info-window/info-window';

declare var google;
@IonicPage()
@Component({
  selector: 'page-map-page',
  templateUrl: 'map-page.html'
})
export class MapPage extends BasePage {

  @ViewChild('map') mapElement: ElementRef;

  private snazzyInfoWindow: any;

  private params: any = {};

  private map: any;
  private geocoder: any;
  // private marker: any;
  private markers: any = [];
  private mapInitialised: boolean = false;
  private location: { lat?: number, lng?: number } = {};
  protected zoomToFit: boolean = true;

  constructor(private injector: Injector,
    private resolver: ComponentFactoryResolver,
    // private storage: LocalStorage,
    private placeService: Place,
    private geolocation: Geolocation) {
    super(injector);


  }

  enableMenuSwipe() {
    return false;
  }

  ionViewDidLoad() {
    if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
      this.loadGoogleMaps()
    } else {
      this.initMap();
    }
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}

  loadGoogleMaps() {

    this.showLoadingView();

    window['mapInit'] = () => {
      this.showContentView();
      this.initMap();
    }

    const apiKey = AppConfig.GOOGLE_MAPS_API_KEY;

    let script = document.createElement('script');
    script.id = 'googleMaps';
    script.src = `https://maps.google.com/maps/api/js?key=${apiKey}&callback=mapInit`;
    document.body.appendChild(script);

  }

  async initMap() {

    // this.snazzyInfoWindow = require('snazzy-info-window');

    this.geocoder = new google.maps.Geocoder();

    this.mapInitialised = true;

    let mapOptions: any = {
      styles: MapStyle.light(),
      zoom: 2,
      center: { lat: 0, lng: 0 },
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

    try {const options: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 60000
    };

    let pos = await this.geolocation.getCurrentPosition(options);

    this.location.lat = pos.coords.latitude;
    this.location.lng = pos.coords.longitude;

    this.markers = new google.maps.Marker({
      icon: {
        url: './assets/img/pin.png',
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
      },
      position: {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      },
      map: this.map,
    });
   

    this.map.panTo(this.location);
    this.map.setZoom(15);

  } catch (err) {
      console.warn(err);
      this.translate.get('ERROR_LOCATION_UNAVAILABLE').subscribe(str => this.showToast(str));
    }
  }

  setMapOnAll(map) {
    this.markers.forEach(marker => {
      marker.setMap(map);
    });
  }

  goToPlace(place) {
    this.navigateTo('PlaceDetailPage', { place: place });
  }

  onSearchAddress(event: any) {

    if (!this.mapInitialised) return;

    let query = event.target.value;

    this.geocoder.geocode({ address: query }, (results, status) => {

      if (status === 'OK') {

        const target = results[0].geometry.location;

        this.map.panTo(target);

        this.params.location = {
          latitude: target.lat(),
          longitude: target.lng()
        };

        this.zoomToFit = false;

        this.showLoadingView();
        this.onReload();

      }
    });
  }

  async loadData() {

    try {
      let places = await this.placeService.load(this.params)
      this.onPlacesLoaded(places);
      this.showContentView();
  
      if (!places.length) {
        this.translate.get('EMPTY_PLACES').subscribe(str => this.showToast(str));
      }

    } catch (err) {
      console.log(err);
      this.translate.get('ERROR_NETWORK').subscribe(str => this.showToast(str));
      this.showContentView();
    }
  }

  onPlacesLoaded(places) {

    let bounds = new google.maps.LatLngBounds();
    let points = [];

    for (let place of places) {

      let position = new google.maps.LatLng(place.location.latitude, place.location.longitude);
      
      bounds.extend(position);
    

      const marker = new google.maps.Marker({
        icon: {
          url: place.category.icon ? place.category.icon.url() : './assets/img/pin.png',
          scaledSize: new google.maps.Size(32, 32),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(0, 0)
        },
        position: position,
        map: this.map,
      });

      this.markers.push(marker);

      const factory = this.resolver.resolveComponentFactory(InfoWindowComponent);
      const component = factory.create(this.injector);
      component.instance.place = place;
      component.instance.location = this.params.location;
      component.changeDetectorRef.detectChanges();

      new this.snazzyInfoWindow({
        marker: marker,
        content: component.location.nativeElement,
        backgroundColor: '#fff',
        fontColor: '#444',
        fontSize: '12px',
        padding: '8px',
        wrapperClass: 'info-window-wrapper',
        showCloseButton: false,
        panOnOpen: true,
        closeWhenOthersOpen: true,
        offset: {
          top: '-4px',
          left: '16px'
        }
      });

      points.push(position);
    }

    if (points.length && this.zoomToFit) {
      this.map.fitBounds(bounds);
    }

  }

  onReload() {
    this.setMapOnAll(null);
    this.markers = [];
    this.loadData();
  }


  onSearchButtonTapped() {

    if (!this.mapInitialised) return;

    let bounds = this.map.getBounds();

    this.params.location = [{
      latitude: bounds.getSouthWest().lat(),
      longitude: bounds.getSouthWest().lng(),
    }, {
      latitude: bounds.getNorthEast().lat(),
      longitude: bounds.getNorthEast().lng()
    }];

    this.zoomToFit = false;

    this.showLoadingView();
    this.onReload();
  }

}
