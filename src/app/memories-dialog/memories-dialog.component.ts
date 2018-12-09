import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Memory } from '../memory';

@Component({
  selector: 'app-memories-dialog',
  templateUrl: './memories-dialog.component.html',
  styleUrls: ['./memories-dialog.component.css'],
})
export class MemoriesDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { memories: Memory[], memoryTitles: string[] }) { }
}
