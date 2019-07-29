import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatTableDataSource } from '@angular/material';
import { DialogData, ModalData } from './modalData.interface';
@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html',
  styleUrls: ['./modals.component.css']
})
export class ModalsComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalData,
              public dialogRef: MatDialogRef<ModalsComponent>,
              public dialog: MatDialog,
  ) { }
  displayedColumns: string[] = ['author', 'body'];
  comments: any;
  ngOnInit() {
    console.log('incoming data', this.data);
    this.comments = [...this.data.data];
  }
  close(): void {
    this.comments = [];
    this.dialogRef.close();
  }
}
