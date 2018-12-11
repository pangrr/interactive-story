import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Event } from '../game';

@Component({
  selector: 'app-mind',
  templateUrl: './mind.component.html',
  styleUrls: ['./mind.component.css']
})
export class MindComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public mind: Event[]) { }
}
