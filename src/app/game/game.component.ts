import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MemoriesDialogComponent } from '../memories-dialog/memories-dialog.component';
import { Memory } from '../memory';
import { Scene } from '../scene';
import { GameService } from '../game.service';
import { Game } from '../game';
import { Action } from '../action';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  game: Game;

  constructor(
    private service: GameService,
    public memoriesDialog: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon(
      'recall',
      sanitizer.bypassSecurityTrustResourceUrl('assets/recall.svg'));
  }

  ngOnInit() {
    this.game = this.service.getGame();
  }

  takeAction(action: Action): void {
    if (action.recallMemoryTitle) {
      this.recallMemory(action.recallMemoryTitle);
    }
    if (action.nextSceneTitle) {
      this.nextScene(action.nextSceneTitle);
    }
  }

  getCurrentScene(): Scene {
    for (const scene of this.game.scenes) {
      if (scene.title === this.game.currentSceneTitle) {
        return scene;
      }
    }
  }

  recallMemory(memoryTitle?: string): void {
    if (memoryTitle) {
      this.addToCurrentMemoryIfNotExist(memoryTitle);
    }

    this.memoriesDialog.open(MemoriesDialogComponent, {
      width: '800px',
      data: {
        memories: this.collectCurrentMemories(),
        memoryTitle
      }
    });
  }

  private nextScene(sceneTitle: string): void {
    this.game.currentSceneTitle = sceneTitle;
  }

  private collectCurrentMemories(): Memory[] {
    return this.game.currentMemoryTitles.map(title => this.getMemoryByTitle(title));
  }

  private addToCurrentMemoryIfNotExist(memoryTitle: string): void {
    if (!this.game.currentMemoryTitles.includes(memoryTitle)) {
      this.game.currentMemoryTitles.push(memoryTitle);
    }
  }

  private getMemoryByTitle(title: string): Memory {
    for (const memory of this.game.memories) {
      if (memory.title === title) {
        return memory;
      }
    }
  }
}


