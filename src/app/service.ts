import { Injectable } from '@angular/core';
import { Script } from './script';
import { Snapshot } from './game';

@Injectable({
  providedIn: 'root'
})
export class Service {
  script: Script;
  history: Snapshot[];

  constructor() { }

  saveScript(script: Script): void {
    this.script = script;
  }

  getScript(): Script {
    return this.script;
  }

  saveHistory(history: Snapshot[]): void {
    this.history = history;
  }

  getHistory(): Snapshot[] {
    return this.history;
  }
}

