import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NotesComponent } from '../notes/notes.component';
import { GameService } from '../game.service';
import { Action } from '../game';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Game, Event } from '../game';
import { MindComponent } from '../mind/mind.component';


@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.css']
})
export class GamePlayComponent implements OnInit {
  game: Game;

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

  takeAction(action: Action): void {
    if (action.openMind) {
      this.openMind(action.openMind);
    }
    this.game.takeAction(action);
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


