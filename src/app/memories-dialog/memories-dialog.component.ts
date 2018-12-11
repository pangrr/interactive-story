import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Memory } from '../game';

@Component({
  selector: 'app-memories-dialog',
  templateUrl: './memories-dialog.component.html',
  styleUrls: ['./memories-dialog.component.css']
})
export class MemoriesDialogComponent {
  public memories: Memory[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { oldMemories: Memory[], recentMemories: Memory[] }) {
    this.memories = [...data.recentMemories, ...data.oldMemories];
  }
}
