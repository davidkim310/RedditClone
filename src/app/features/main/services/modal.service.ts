import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ModalsComponent } from '../components/modals/modals.component';

@Injectable()
export class ModalService {

  constructor(public dialog: MatDialog) { }

  openDetailsModal(data): void {
    console.log('calling modal');
    const dialogRef = this.dialog.open(ModalsComponent, {
      data: {data},
      disableClose: true,
      maxHeight: '98%',
      maxWidth: '100%',
      width: '600px',
      autoFocus: false
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
