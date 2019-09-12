import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RedditService {
  limit = 10;
  // baseUrl = 'https://www.reddit.com/r/programmerhumor/new.json';
  pageId;
  constructor(private http: HttpClient) { }

  buildUrl(type, query) {
    if (type === 'initial') {
      return 'https://www.reddit.com/r/' + query + '/new.json' + '?limit=' + this.limit;
    } else if (type === 'next') {
      return 'https://www.reddit.com/r/' + query + '/new.json' + '?limit=' + this.limit + '&after=' + this.pageId;
    }
    // Before call is broken on the Reddit API
    // else if (type === 'back') {
    //   return this.baseUrl + '?limit=' + this.limit + '&before=' + this.pageId;
    // }
  }
  searchReddit(query) {
    return this.http.get('https://www.reddit.com/r/' + query + '/new.json');
  }
  getInitial(query) {
    return this.http.get(this.buildUrl('initial', query));
  }
  navigate(pageId, query) {
    this.pageId = pageId;
    return this.http.get(this.buildUrl('next', query));
  }

  // Before call is broken on the Reddit API
  // goBack(pageId) {
  //   this.pageId = pageId;
  //   return this.http.get(this.buildUrl('back'));
  // }

  getComments(postId, query) {
    return this.http.get('https://www.reddit.com/r/' + query + '/comments/' + postId + '.json');
  }
  getSuggestions(query) {
    return this.http.get('https://api.reddit.com/search?q=' + query);
  }
}
