import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotesComponent } from '../notes/notes.component';
import { ScriptService } from '../script.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { StoryPlayable } from '../story-playable';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-play-story',
  templateUrl: './play-story.component.html',
  styleUrls: ['./play-story.component.css']
})
export class PlayStoryComponent implements OnInit {
  storyPlayable: StoryPlayable;
  objectKeys = Object.keys;

  constructor(
    private service: ScriptService,
    public notes: MatDialog,
    public dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('notes', sanitizer.bypassSecurityTrustResourceUrl('assets/notes.svg'));
  }

  ngOnInit() {
    this.storyPlayable = new StoryPlayable(this.service.getScript());
  }

  takeAction(actionKey: string): void {
    const thought = this.storyPlayable.currentEvent.actionsAvailable[actionKey].think;
    if (thought) {
      this.openDialog(thought);
    }
    this.storyPlayable.takeAction(actionKey);
  }

  triggerNextEvent(): void {
    this.storyPlayable.triggerNextEvent();
  }

  openNotes(): void {
    this.notes.open(NotesComponent, {
      width: '800px',
      data: {
        oldNotes: this.storyPlayable.oldNotes,
        newNotes: this.storyPlayable.newNotes
      }
    });
  }

  openDialog(content: string): void {
    this.dialog.open(DialogComponent, {
      width: '800px',
      data: content
    });
  }
}


