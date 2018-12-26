import { Injectable } from '@angular/core';
import { Script } from './script';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  script: Script;
  firstEventId: string;

  constructor() { }

  setScript(script: Script): void {
    this.script = script;
  }

  getScript(): Script {
    return this.script;
  }

  setFirstEventId(eventId: string): void {
    this.firstEventId = eventId;
  }

  getFirstEventId(): string {
    return this.firstEventId;
  }
}

