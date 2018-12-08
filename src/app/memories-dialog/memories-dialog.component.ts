import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Memory } from '../memory';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-memories-dialog',
  templateUrl: './memories-dialog.component.html',
  styleUrls: ['./memories-dialog.component.css'],
})
export class MemoriesDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MemoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public memories: Memory[]) { }

}
