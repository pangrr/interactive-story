import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-thought-dialog',
  templateUrl: './thought-dialog.component.html',
  styleUrls: ['./thought-dialog.component.css']
})
export class ThoughtDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public content: string) { }
}
