import { Injectable } from '@angular/core';
import { Script } from './script';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  script: Script;

  constructor() { }

  setScript(script: Script): void {
    this.script = script;
  }

  getScript(): Script {
    return this.script;
  }
}

