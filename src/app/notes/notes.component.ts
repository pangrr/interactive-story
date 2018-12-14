import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Notes } from '../story-playable';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  notes: Notes;
  objectKeys = Object.keys;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { oldNotes: Notes, newNotes: Notes }) {
    this.notes = { ...data.oldNotes, ...data.newNotes };
  }
}
