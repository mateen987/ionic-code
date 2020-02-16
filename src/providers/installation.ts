import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { AppConfig } from '../app/app.config';

@Injectable()
export class Installation {

  constructor(public http: HttpClient) {
  }

  save(id, data: any): Observable<any> {

    const headers = new HttpHeaders().set('X-Parse-Application-Id', AppConfig.APP_ID)
    let bodyString = JSON.stringify(data);

    let url = `${AppConfig.SERVER_URL}/installations/${id}`;

    return this.http.put(url, bodyString, { headers })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

}
