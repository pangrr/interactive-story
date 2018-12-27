import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
import { ScriptService } from '../script.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Game } from '../game';
import { ThoughtDialogComponent } from '../thought-dialog/thought-dialog.component';
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
    public notesDialog: MatDialog,
    public thoughtDialog: MatDialog,
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
    this.game.takeAction(actionKey);
    if (this.game.thought) {
      this.openThought(this.game.thought);
    }
  }

  triggerNextEvent(): void {
    this.game.triggerNextEvent();
  }

  openNotes(): void {
    this.notesDialog.open(NotesDialogComponent, {
      width: '800px',
      data: {
        oldNotes: this.game.oldNotes,
        newNotes: this.game.newNotes
      }
    });
    this.game.antiquateNewNotes();
  }

  private openThought(thought: string): void {
    const dialogRef = this.thoughtDialog.open(ThoughtDialogComponent, {
      width: '800px',
      data: thought
    });

    dialogRef.afterClosed().subscribe(() => this.game.thought = undefined);
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


