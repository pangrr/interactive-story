import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
import { Service } from '../service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Game, Snapshot } from '../game';
import { ThoughtDialogComponent } from '../thought-dialog/thought-dialog.component';
import { Router } from '@angular/router';
import { Event } from '../script';


@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent {
  game: Game;
  history: Snapshot[] = [];
  objectKeys = Object.keys;

  constructor(
    private service: Service,
    public notesDialog: MatDialog,
    public thoughtDialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private router: Router
  ) {
    iconRegistry.addSvgIcon('notes', sanitizer.bypassSecurityTrustResourceUrl('assets/notes.svg'));
    iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('assets/edit.svg'));
    iconRegistry.addSvgIcon('step_back', sanitizer.bypassSecurityTrustResourceUrl('assets/step_back.svg'));

    const script = this.service.getScript();
    if (!script) {
      this.router.navigate(['/edit']);
    } else {
      this.game = new Game(script);
      const history = this.service.getHistory();
      if (history) {
        this.replayThroughHistory(history);
      }
    }
  }

  private replayThroughHistory(history: Snapshot[]): void {
    history.forEach(snapshot => {
      if (this.game.script.events[snapshot.currentEvent.id]) {
        this.game.triggerEvent(snapshot.currentEvent.id);
        this.takeSnapshot();
      }
    });
  }

  takeAction(actionDescription: string): void {
    this.takeSnapshot();

    this.game.takeAction(actionDescription);

    if (this.game.thought) {
      this.openThought(this.game.thought);
    }
  }

  triggerNextEventIfAvailable(event: Event): void {
    if (event.nextEvent) {
      this.takeSnapshot();

      this.game.triggerEvent(event.nextEvent);
    }
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

  editScript(): void {
    this.service.saveHistory(this.history);
    this.router.navigate(['/edit']);
  }

  stepBack(): void {
    this.game = new Game(this.history.pop());
    if (this.game.thought) {
      this.openThought(this.game.thought);
    }
  }

  private openThought(thought): void {
    const dialogRef = this.thoughtDialog.open(ThoughtDialogComponent, {
      width: '800px',
      data: thought
    });

    dialogRef.afterClosed().subscribe(() => {
      this.game.thought = undefined;
    });
  }

  private takeSnapshot(): void {
    this.history.push(this.game.takeSnapshot());
  }
}


