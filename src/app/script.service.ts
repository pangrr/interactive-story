import { Injectable } from '@angular/core';
import { Script } from './script';

@Injectable({
  providedIn: 'root'
})
export class ScriptService {
  script: Script;
  savedEventId: string;

  constructor() { }

  setScript(script: Script): void {
    this.script = script;
  }

  getScript(): Script {
    return this.script;
  }

  saveEventId(eventId: string): void {
    this.savedEventId = eventId;
  }

  getSavedEventId(): string {
    return this.savedEventId;
  }
}

