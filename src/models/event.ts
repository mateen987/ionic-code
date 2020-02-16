import firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import {BaseModel} from "./base-model";

export class Event extends BaseModel {

  //
  // table info
  //
  static TABLE_NAME = 'events';
  static FIELD_LAT = 'lat';
  static FIELD_LNG = 'lng';
  
  

  //
  // properties
  //
  
  lat = 0;
  lng = 0;
  



  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.lat = info[Event.FIELD_LAT];
      this.lng = info[Event.FIELD_LNG];

      /*if (Tag.FIELD_RATING in info) {
        this.rating = info[Tag.FIELD_RATING];
      }
      if (Tag.FIELD_REVIEW_COUNT in info) {
        this.reviewCount = info[Tag.FIELD_REVIEW_COUNT];
      }*/
    }
  }

  tableName() {
    return Event.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Event.FIELD_LAT] = this.lat;
    dict[Event.FIELD_LNG] = this.lng;
    
    return dict;
  }
}
