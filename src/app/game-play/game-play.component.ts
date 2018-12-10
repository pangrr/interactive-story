import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MemoriesDialogComponent } from '../memories-dialog/memories-dialog.component';
import { GameService } from '../game.service';
import { Action } from '../game';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { Game } from '../game';


@Component({
  selector: 'app-game-play',
  templateUrl: './game-play.component.html',
  styleUrls: ['./game-play.component.css']
})
export class GamePlayComponent implements OnInit {
  game: Game;

  constructor(
    private service: GameService,
    public memoriesDialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('open-memory', sanitizer.bypassSecurityTrustResourceUrl('assets/question-mark.svg'));
  }

  ngOnInit() {
    this.game = new Game(this.service.getScript());
  }

  takeAction(action: Action): void {
    this.game.takeAction(action);

    if (this.game.recentMemories.length > 0) {
      this.openMemory();
    }
  }

  openMemory(): void {
    this.memoriesDialog.open(MemoriesDialogComponent, {
      width: '800px',
      data: {
        oldMemories: this.game.oldMemories,
        recentMemories: this.game.recentMemories
      }
    });
  }
}


