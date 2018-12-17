import { Component, OnInit } from '@angular/core';
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
export class PlayComponent implements OnInit {
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
  }

  ngOnInit() {
    this.game = new Game(this.service.getScript());
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
    this.router.navigate(['/edit']);
  }
}


