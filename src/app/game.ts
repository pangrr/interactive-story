import { Script, Event, Notes } from './script';

export class Game {
  readonly script: Script;
  currentEvent: CurrentEvent;
  thought: string;
  oldNotes: Notes;
  newNotes: Notes;

  constructor(scriptOrSnapshot: Snapshot | Script) {
    if (this.isSnapshot(scriptOrSnapshot)) {
      this.script = scriptOrSnapshot.script;
      this.thought = scriptOrSnapshot.thought;
      this.oldNotes = scriptOrSnapshot.oldNotes;
      this.newNotes = scriptOrSnapshot.newNotes;
      this.currentEvent = scriptOrSnapshot.currentEvent;
    } else {
      this.script = scriptOrSnapshot;
      this.oldNotes = {};
      this.newNotes = {};
      this.loadFirstEvent();
    }
  }

  takeSnapshot(): Snapshot {
    return {
      script: this.script,
      currentEvent: JSON.parse(JSON.stringify(this.currentEvent)),
      thought: this.thought,
      oldNotes: { ...this.oldNotes },
      newNotes: { ...this.newNotes },
    };
  }

  takeAction(actionDescription: string): void {
    const action = this.currentEvent.actions[actionDescription];
    delete this.currentEvent.actions[actionDescription];

    this.thought = action.think;

    if (action.triggerEvent) {
      this.triggerEvent(action.triggerEvent);
    }
  }

  antiquateNewNotes(): void {
    this.oldNotes = { ...this.oldNotes, ...this.newNotes };
    this.newNotes = {};
  }

  triggerEvent(eventId: string): void {
    this.antiquateNewNotes();
    this.loadCurrentEvent(eventId);
  }

  private loadCurrentEvent(eventId: string): void {
    const eventFromScript = this.script.events[eventId];
    this.currentEvent = {
      id: eventId,
      ...eventFromScript,
      actions: { ...(eventFromScript.actions || {}) },
    };
    if (this.currentEvent.notes) {
      this.updateNotes(this.currentEvent.notes);
    }
  }

  private loadFirstEvent(): void {
    this.loadCurrentEvent(Object.keys(this.script.events)[0]);
  }

  private updateNotes(newNotes: Notes): void {
    Object.keys(newNotes).forEach(key => {
      delete this.oldNotes[key];
      this.newNotes[key] = newNotes[key];
    });
  }

  private isSnapshot(arg: any): arg is Snapshot {
    return arg.script !== undefined;
  }
}


export interface Snapshot {
  readonly script: Script;
  readonly currentEvent: CurrentEvent;
  readonly thought: string;
  readonly oldNotes: Notes;
  readonly newNotes: Notes;
}

export interface CurrentEvent extends Event {
  id: string;
}
