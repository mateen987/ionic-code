import firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import {BaseModel} from "./base-model";

export class FPlace extends BaseModel {

  //
  // table info
  //
  static TABLE_NAME = 'places';
  static FIELD_TITLE = 'title';
  static FIELD_PRICE = 'price';
  static FIELD_DESC = 'desc';
  static FIELD_IMAGE = 'imageUrl';
  static FIELD_RATING = 'rating';
  static FIELD_REVIEW_COUNT = 'reviewCount';
  static FIELD_LAT = 'lat';
  static FIELD_LNG = 'lng';

  static TABLE_NAME_CART = 'carts';
  static TABLE_NAME_PURCHASE = 'purchased';

  //
  // properties
  //
  title = '';
  price = 0;
  desc = '';
  imageUrl = '';
  lat = '';
  lng = '';
  rating = 0;
  reviewCount = 0; 

  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.title = info[FPlace.FIELD_TITLE];
      this.price = info[FPlace.FIELD_PRICE];
      this.desc = info[FPlace.FIELD_DESC];
      this.imageUrl = info[FPlace.FIELD_IMAGE];
      this.lat = info[FPlace.FIELD_LAT];
      this.lng = info[FPlace.FIELD_LNG];

      if (FPlace.FIELD_RATING in info) {
        this.rating = info[FPlace.FIELD_RATING];
      }
      if (FPlace.FIELD_REVIEW_COUNT in info) {
        this.reviewCount = info[FPlace.FIELD_REVIEW_COUNT];
      }
    }
  }

  tableName() {
    return FPlace.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[FPlace.FIELD_TITLE] = this.title;
    dict[FPlace.FIELD_PRICE] = this.price;
    dict[FPlace.FIELD_DESC] = this.desc;
    dict[FPlace.FIELD_IMAGE] = this.imageUrl;
    dict[FPlace.FIELD_RATING] = this.rating;
    dict[FPlace.FIELD_REVIEW_COUNT] = this.reviewCount;
    dict[FPlace.FIELD_LAT] = this.lat;
    dict[FPlace.FIELD_LNG] = this.lng;

    return dict;
  }
}
