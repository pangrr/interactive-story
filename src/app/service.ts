import { Injectable } from '@angular/core';
import { Script } from './script';
import { Save } from './game';

@Injectable({
  providedIn: 'root'
})
export class Service {
  script: Script;
  save: Save;

  constructor() { }

  saveScript(script: Script): void {
    this.script = script;
  }

  getScript(): Script {
    return this.script;
  }

  saveGame(save: Save): void {
    this.save = save;
  }

  getSave(): Save {
    return this.save;
  }
}

