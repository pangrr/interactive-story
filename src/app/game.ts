import { Script, Event, Actions, Notes } from './script';

export class Game {
  readonly script: Script;
  history: EventHappened[];
  currentEvent: EventHappened;
  oldNotes: Notes;
  newNotes: Notes;

  constructor(scriptOrSave: Save | Script) {
    if (this.isSave(scriptOrSave)) {
      this.script = scriptOrSave.script;
      this.history = scriptOrSave.history;
      this.oldNotes = scriptOrSave.oldNotes;
      this.newNotes = scriptOrSave.newNotes;
      this.currentEvent = scriptOrSave.currentEvent;
    } else {
      this.script = scriptOrSave;
      this.history = [];
      this.oldNotes = {};
      this.newNotes = {};
      this.loadCurrentEvent(this.script.firstEvent);
      if (this.currentEvent.notes) {
        this.updateNotes(this.currentEvent.notes);
      }
    }
  }

  save(): Save {
    return {
      script: this.script,
      history: this.history,
      currentEvent: this.currentEvent,
      oldNotes: this.oldNotes,
      newNotes: this.newNotes
    };
  }

  takeAction(actionKey: string): void {
    delete this.currentEvent.actionsAvailable[actionKey];
    this.currentEvent.actionsTaken.push(actionKey);

    if (this.currentEvent.actions[actionKey].triggerEvent) {
      this.triggerEvent(this.currentEvent.actions[actionKey].triggerEvent);
    }
  }

  triggerNextEvent(): void {
    if (this.currentEvent.nextEvent) {
      this.triggerEvent(this.currentEvent.nextEvent);
    }
  }

  private triggerEvent(eventTitle: string): void {
    this.antiquateNewNotes();

    this.pushCurrentEventToHistory();
    this.loadCurrentEvent(eventTitle);
    if (this.currentEvent.notes) {
      this.updateNotes(this.currentEvent.notes);
    }
  }

  private updateNotes(newNotes: Notes): void {
    Object.keys(newNotes).forEach(key => {
      delete this.oldNotes[key];
      this.newNotes[key] = newNotes[key];
    });
  }

  private antiquateNewNotes(): void {
    this.oldNotes = { ...this.oldNotes, ...this.newNotes };
    this.newNotes = {};
  }

  private pushCurrentEventToHistory(): void {
    this.history.push(this.currentEvent);
  }

  private loadCurrentEvent(eventKey: string): void {
    const eventFromScript = this.script.events[eventKey];
    this.currentEvent = {
      ...eventFromScript,
      actionsAvailable: { ...(eventFromScript.actions || {}) },
      actionsTaken: []
    };
  }

  private isSave(arg: any): arg is Save {
    return arg.script !== undefined;
  }
}


export interface Save {
  readonly script: Script;
  readonly history: EventHappened[];
  readonly currentEvent: EventHappened;
  readonly oldNotes: Notes;
  readonly newNotes: Notes;
}

export interface EventHappened extends Event {
  actionsAvailable: Actions;
  actionsTaken: string[];
}
