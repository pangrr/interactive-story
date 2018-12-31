import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotesDialogComponent } from '../notes-dialog/notes-dialog.component';
import { Service } from '../service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Game, Save } from '../game';
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
      const save = this.service.getSave();
      if (save) {
        const newSave = { ...save, script };
        this.game = new Game(newSave);
      } else {
        this.game = new Game(script);
      }
    }
  }

  takeAction(actionDescription: string): void {
    this.game.takeAction(actionDescription);

    if (this.game.thought) {
      this.openThought(this.game.thought);
    }
  }

  triggerNextEventIfAvailable(event: Event): void {
    if (event.nextEvent) {
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
  }

  editScript(): void {
    this.service.saveGame(this.game.save());
    this.router.navigate(['/edit']);
  }

  previousEvent(): void {
    this.game.previousEvent();
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
}


