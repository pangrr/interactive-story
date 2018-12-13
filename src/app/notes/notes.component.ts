import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Notes } from '../game';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  notes: Notes;
  noteList: string[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { oldNotes: Notes, newNotes: Notes }) {
    this.notes = { ...data.oldNotes, ...data.newNotes };
    this.noteList = [...Object.keys(data.newNotes), ...Object.keys(data.oldNotes)];
  }
}
