import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotesComponent } from '../notes/notes.component';
import { GameService } from '../game.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Game } from '../game';
import { MindComponent } from '../mind/mind.component';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;
  objectKeys = Object.keys;

  constructor(
    private service: GameService,
    public notes: MatDialog,
    public mind: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('notes', sanitizer.bypassSecurityTrustResourceUrl('assets/notes.svg'));
  }

  ngOnInit() {
    this.game = new Game(this.service.getScript());
  }

  takeAction(actionKey: string): void {
    const openMind = this.game.currentEvent.actionsAvailable[actionKey].openMind;
    if (openMind) {
      this.openMind(openMind);
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
      },
      backdropClass: 'backdrop'
    });
  }

  openMind(mind: string): void {
    this.mind.open(MindComponent, {
      width: '800px',
      data: mind,
      backdropClass: 'backdrop'
    });
  }
}


