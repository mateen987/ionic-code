import { Component, Input, Renderer } from '@angular/core';
import { Place } from '../../providers/place-service';
import { ImgLoader } from 'ionic-image-loader';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'info-window',
  templateUrl: 'info-window.html'
})
export class InfoWindowComponent {

  @Input() place: Place;
  @Input() location;

  constructor(private renderer: Renderer, private navCtrl: NavController) {
  }

  onImageLoad(imgLoader: ImgLoader) {
    this.renderer.setElementClass(imgLoader.element, 'fade-in', true);
  }

  goToPlace() {
    this.navCtrl.push('PlaceDetailPage', { place: this.place });
  }

}
