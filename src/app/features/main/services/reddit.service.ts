import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RedditService {
  limit = 10;
  baseUrl = 'https://www.reddit.com/r/programmerhumor/new.json';
  pageId;
  constructor(private http: HttpClient) { }

  buildUrl(type) {
    if (type === 'initial') {
      return this.baseUrl + '?limit=' + this.limit;
    } else if (type === 'next') {
      return this.baseUrl + '?limit=' + this.limit + '&after=' + this.pageId;
    }
    // Before call is broken on the Reddit API
    // else if (type === 'back') {
    //   return this.baseUrl + '?limit=' + this.limit + '&before=' + this.pageId;
    // }
  }
  getInitial() {
    return this.http.get(this.buildUrl('initial'));
  }
  navigate(pageId) {
    this.pageId = pageId;
    return this.http.get(this.buildUrl('next'));
  }

  // Before call is broken on the Reddit API
  // goBack(pageId) {
  //   this.pageId = pageId;
  //   return this.http.get(this.buildUrl('back'));
  // }

  getComments(postId) {
    return this.http.get('https://www.reddit.com/r/programmerhumor/comments/' + postId + '.json');
  }
}
