import { Component, OnInit } from '@angular/core';
import { RedditService } from '../../services/reddit.service';
import {PageEvent} from '@angular/material/paginator';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  data: any;
  comments: any;
  commentsArray = [];
  pageId: string;
  pageIndex: number;
  pageIds = [];
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
    this.redditService.getInitial().subscribe((res: any) => {
      this.data = res.data;
      console.log('this.data', this.data);
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
  showDetails(item) {
    console.log('item selected', item.data);
  }
  pageclicked(event) {
    console.log(event);
    this.dataPending = true;
    if (this.pageIndex < event.pageIndex) {
      this.redditService.navigate(this.pageId).subscribe((res: any) => {
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
      this.redditService.navigate(this.pageId).subscribe((res: any) => {
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
    this.redditService.getComments(row.id).subscribe((res: any) => {
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
}
