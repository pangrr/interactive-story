import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Notes } from '../script';

@Component({
  selector: 'app-notes-dialog',
  templateUrl: './notes-dialog.component.html',
  styleUrls: ['./notes-dialog.component.css']
})
export class NotesDialogComponent {
  notes: Notes;
  objectKeys = Object.keys;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { oldNotes: Notes, newNotes: Notes }) {
    this.notes = { ...data.oldNotes, ...data.newNotes };
  }
}
