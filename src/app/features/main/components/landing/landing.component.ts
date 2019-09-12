import { Component, OnInit } from '@angular/core';
import { RedditService } from '../../services/reddit.service';
import {PageEvent} from '@angular/material/paginator';
import { ModalService } from '../../services/modal.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {startWith, map} from 'rxjs/operators';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  control = new FormControl();
  data: any;
  comments: any;
  commentsArray = [];
  pageId: string;
  pageIndex: number;
  pageIds = [];
  subreddit: string = '';
  suggestionsArray = [];
  filteredSuggs: Observable<string[]>;
  searchQuery: string;
  displayedColumns: string[] = ['thumbnail', 'title'];
  dataPending = true;
  // MatPaginator Inputs
  length = 100;
  pageSize = 10;
  pageSizeOptions: number[] = [10];
  // MatPaginator Output
  pageEvent: PageEvent;
  constructor(
    private redditService: RedditService,
    private modalService: ModalService
    ) { }

  ngOnInit() {
    // this.redditService.getInitial().subscribe((res: any) => {
    //   this.data = res.data;
    //   console.log('this.data', this.data);
    // }, error => {
    //   console.log('err', error);
    // },
    //  () => {
    //   this.pageId = this.data.after;
    //   this.pageIds.push(this.pageId);
    //   this.pageIndex = 0;
    //   this.dataPending = false;
    // });
    this.filteredSuggs = this.control.valueChanges.pipe(
      startWith(''),
      map(value => {
        console.log('value', value);
        return this._filter(value);
      })
    );
  }
  showDetails(item) {
    console.log('item selected', item.data);
  }
  pageclicked(event) {
    console.log(event);
    this.dataPending = true;
    if (this.pageIndex < event.pageIndex) {
      this.redditService.navigate(this.pageId, this.searchQuery).subscribe((res: any) => {
        this.data = res.data;
        console.log('res', res.data);
      }, error => {
        console.log('err', error);
      },
       () => {
        this.pageId = this.data.after;
        this.dataPending = false;
        if (!this.pageIds.includes(this.pageId)) {
          this.pageIds.push(this.pageId);
        }
        console.log('pageIds: ', this.pageIds);
        this.pageIndex++;
      });
    } else {
      this.pageId = this.pageIds[this.pageIndex - 1];
      this.redditService.navigate(this.pageId, this.searchQuery).subscribe((res: any) => {
        this.data = res.data;
        console.log('res', res.data);
      }, error => {
        console.log('err', error);
      },
      () => {
        this.pageId = this.data.after;
        this.dataPending = false;
        this.pageIndex--;
      });
      }
  }
  rowClicked(row) {
    console.log('row', row.id);
    this.dataPending = true;
    this.redditService.getComments(row.id, this.searchQuery).subscribe((res: any) => {
      this.comments = res;
      // console.log('this.comments', this.comments);
      // tslint:disable-next-line:prefer-for-of
      let arry = [];
      for (let i = 0; i < this.comments.length; i++) {
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.comments[i].data.children.length; j++) {
          if (this.comments[i].data.children[j].kind === 't1') {
            console.log('comment', this.comments[i].data.children[j].data);
            let commentObj = {
              author: this.comments[i].data.children[j].data.author,
              body: this.comments[i].data.children[j].data.body
            };
            arry.push(commentObj);
          }
        }
      }
      this.commentsArray = arry;
    }, error => {
      console.log('err', error);
    },
     () => {
      this.dataPending = false;
    });
    const data = {
      image: row.thumbnail
    };
    this.modalService.openDetailsModal(this.commentsArray);
  }
  search() {
    console.log('formvalue', this.control.value);
    console.log('search', this.searchQuery);
    this.subreddit = this.control.value;
    this.redditService.searchReddit(this.control.value).subscribe((res: any) => {
      this.data = res.data;
      // console.log('this.data', this.data);
    }, error => {
      console.log('err', error);
    },
     () => {
      this.pageId = this.data.after;
      this.pageIds.push(this.pageId);
      this.pageIndex = 0;
      this.dataPending = false;
    });
  }
  suggestions() {
    this.redditService.getSuggestions(this.control.value).subscribe((res: any) => {
      console.log('res ontype', res.data.children);
      this.suggestionsArray = [];
      for (let i = 0; i < 6; i++) {
        if (!this.suggestionsArray.includes(res.data.children[i].data.subreddit)) {
          this.suggestionsArray.push(res.data.children[i].data.subreddit);
        }
      }
      // this.suggestionsArray = [res.data.children[0].data.subreddit, res.data.children[0].data.subreddit];
      console.log('suggarray', this.suggestionsArray);
    });
  }
  private _filter(value: string): string[] {
    // const filterValue = this._normalizeValue(value);
    // console.log('fitlerValue', filterValue)
    return this.suggestionsArray;
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
