import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Note } from '../game';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent {
  public notes: Note[];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { oldNotes: Note[], newNotes: Note[] }) {
    this.notes = [...data.newNotes, ...data.oldNotes];
  }
}
