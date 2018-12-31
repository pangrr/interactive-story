import { Script, Event, Notes } from './script';

export class Game {
  readonly script: Script;
  currentEvent: Event;
  thought: string;
  oldNotes: Notes;
  newNotes: Notes;
  history: string[]; // list of event ids as they occured

  constructor(scriptOrSave: Save | Script) {
    this.oldNotes = {};
    this.newNotes = {};
    this.history = [];
    if (this.isSave(scriptOrSave)) {
      this.script = scriptOrSave.script;
      this.replayHistory(scriptOrSave.history);
    } else {
      this.script = scriptOrSave;
      this.loadFirstEvent();
    }
  }

  takeAction(actionDescription: string): void {
    const action = this.currentEvent.actions[actionDescription];
    if (action) {
      delete this.currentEvent.actions[actionDescription];

      this.thought = action.think;

      if (action.triggerEvent) {
        this.triggerEvent(action.triggerEvent);
      }
    } else {
      console.error('action not exist', actionDescription, this.currentEvent);
    }
  }

  triggerEvent(eventId: string): void {
    const eventFromScript = this.script.events[eventId];

    if (eventFromScript) {
      this.currentEvent = {
        ...eventFromScript,
        actions: { ...(eventFromScript.actions || {}) },
      };

      this.antiquateNewNotes();
      if (this.currentEvent.notes) {
        this.updateNotes(this.currentEvent.notes);
      }

      this.history.push(eventId);
    } else {
      console.error('event not exist', eventId, this.script);
    }
  }

  previousEvent(): void {
    const history = [...this.history];
    history.pop();
    this.history = [];
    this.replayHistory(history);
  }

  save(): Save {
    return {
      script: this.script,
      history: this.history
    };
  }

  private antiquateNewNotes(): void {
    this.oldNotes = { ...this.oldNotes, ...this.newNotes };
    this.newNotes = {};
  }

  private replayHistory(history: string[]): void {
    history.forEach(eventId => this.triggerEvent(eventId));
  }

  private loadFirstEvent(): void {
    this.triggerEvent(Object.keys(this.script.events)[0]);
  }

  private updateNotes(newNotes: Notes): void {
    Object.keys(newNotes).forEach(key => {
      delete this.oldNotes[key];
      this.newNotes[key] = newNotes[key];
    });
  }

  private isSave(arg: any): arg is Save {
    return arg.script !== undefined && arg.history !== undefined;
  }
}


export interface Save {
  readonly script: Script;
  readonly history: string[]; // list of event ids as they occured
}
