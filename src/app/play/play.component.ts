import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotesComponent } from '../notes/notes.component';
import { ScriptService } from '../script.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Game } from '../game';
import { DialogComponent } from '../dialog/dialog.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent {
  game: Game;
  objectKeys = Object.keys;

  constructor(
    private service: ScriptService,
    public notes: MatDialog,
    public dialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router
  ) {
    iconRegistry.addSvgIcon('notes', sanitizer.bypassSecurityTrustResourceUrl('assets/notes.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/edit.svg'));

    const script = this.service.getScript();
    if (!script) {
      this.router.navigate(['/edit']);
    } else {
      this.game = new Game(this.service.getScript());
      const savedEventId = this.service.getSavedEventId();
      if (savedEventId) {
        this.game.loadCurrentEvent(savedEventId);
      }
    }
  }

  takeAction(actionKey: string): void {
    const thought = this.game.currentEvent.actionsAvailable[actionKey].think;
    if (thought) {
      this.openDialog(thought);
    }
    this.game.takeAction(actionKey);
  }

  triggerNextEvent(): void {
    this.game.triggerNextEvent();
  }

  openNotes(): void {
    this.notes.open(NotesComponent, {
      width: '800px',
      data: {
        oldNotes: this.game.oldNotes,
        newNotes: this.game.newNotes
      }
    });
  }

  openDialog(content: string): void {
    this.dialog.open(DialogComponent, {
      width: '800px',
      data: content
    });
  }

  editScript(): void {
    this.service.saveEventId(this.getSecondFromLastEventId());
    this.router.navigate(['/edit']);
  }

  private getSecondFromLastEventId(): string {
    const history = this.game.history;

    if (history.length >= 2) {
      return history[history.length - 2].id;
    } else if (history.length >= 1) {
      return history[history.length - 1].id;
    } else {
      return this.game.currentEvent.id;
    }
  }
}


