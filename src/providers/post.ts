import { Injectable } from '@angular/core';
import Parse from 'parse';

@Injectable()
export class Post extends Parse.Object {

  constructor() {
    super('Post');
  }

  load(params: any = {}): Promise<Post[]> {
    return new Promise((resolve, reject) => {

      let page = params.page || 0;
      let limit = params.limit || 100;
      
      let query = new Parse.Query(Post);

      query.skip(page * limit);
      query.limit(limit);
      query.include('place');
      query.descending('createdAt');
      query.find().then((data: Post[]) => resolve(data), error => reject(error));
    });
  }

  get title(): string {
    return this.get('title');
  }

  get body(): string {
    return this.get('body');
  }

  get image(): any {
    return this.get('image');
  }

  get place(): any {
    return this.get('place');
  }

  toString(): string {
    return this.title;
  }
}

Parse.Object.registerSubclass('Post', Post);