import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MatDialogActions,
  MatDialogClose,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { TaskComponent } from '../task/task.component';
@Component({
  selector: 'app-cathegories',
  templateUrl: './cathegories.component.html',
  styleUrl: './cathegories.component.scss'
})
export class CathegoriesComponent {





}

@Component({
  selector: 'dialog-animations-example-dialog',
  templateUrl: 'modal.html',
})
export class ModalDIalog {
  constructor(public dialogRef: MatDialogRef<ModalDIalog>) {}
}