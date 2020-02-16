import firebase from 'firebase';
import DataSnapshot = firebase.database.DataSnapshot;
import {BaseModel} from "./base-model";

export class Tag extends BaseModel {

  //
  // table info
  //
  static TABLE_NAME = 'tags';
  static FIELD_DISTANCE = 'distance';
  static FIELD_IMAGE = 'image';
  static FIELD_NAME = 'name';
  static FIELD_NUMBER = 'number';
  

  //
  // properties
  //
  name = '';
  distance = 0;
  number = 0;
  image = '';



  constructor(snapshot?: DataSnapshot) {
    super(snapshot);

    if (snapshot) {
      const info = snapshot.val();

      this.name = info[Tag.FIELD_NAME];
      this.distance = info[Tag.FIELD_DISTANCE];
      this.number = info[Tag.FIELD_NUMBER];
      this.image = info[Tag.FIELD_IMAGE];

      /*if (Tag.FIELD_RATING in info) {
        this.rating = info[Tag.FIELD_RATING];
      }
      if (Tag.FIELD_REVIEW_COUNT in info) {
        this.reviewCount = info[Tag.FIELD_REVIEW_COUNT];
      }*/
    }
  }

  tableName() {
    return Tag.TABLE_NAME;
  }

  toDictionary() {
    const dict = super.toDictionary();

    dict[Tag.FIELD_NAME] = this.name;
    dict[Tag.FIELD_DISTANCE] = this.distance;
    dict[Tag.FIELD_NUMBER] = this.number;
    dict[Tag.FIELD_IMAGE] = this.image;
    
    return dict;
  }
}
