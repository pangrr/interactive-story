import { Script, Event, Actions, Notes } from './script';

export class Game {
  readonly script: Script;
  currentEvent: EventHappened;
  thought: string;
  oldNotes: Notes;
  newNotes: Notes;
  history: EventHappened[];

  constructor(scriptOrSnapshot: Snapshot | Script) {
    if (this.isSnapshot(scriptOrSnapshot)) {
      this.script = scriptOrSnapshot.script;
      this.thought = scriptOrSnapshot.thought;
      this.oldNotes = scriptOrSnapshot.oldNotes;
      this.newNotes = scriptOrSnapshot.newNotes;
      this.currentEvent = scriptOrSnapshot.currentEvent;
      this.history = scriptOrSnapshot.history;
    } else {
      this.script = scriptOrSnapshot;
      this.history = [];
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
      history: JSON.parse(JSON.stringify(this.history))
    };
  }

  takeAction(actionId: string): void {
    const action = this.currentEvent.actionsAvailable[actionId];
    this.currentEvent.actionsTaken[actionId] = action;
    delete this.currentEvent.actionsAvailable[actionId];

    this.thought = action.think;

    if (action.triggerEvent) {
      this.triggerEvent(action.triggerEvent);
    }
  }

  triggerNextEvent(): void {
    if (this.currentEvent.nextEvent) {
      this.triggerEvent(this.currentEvent.nextEvent);
    }
  }

  loadCurrentEvent(eventId: string): void {
    const eventFromScript = this.script.events[eventId];
    this.currentEvent = {
      id: eventId,
      ...eventFromScript,
      actionsAvailable: { ...(eventFromScript.actions || {}) },
      actionsTaken: {}
    };
    if (this.currentEvent.notes) {
      this.updateNotes(this.currentEvent.notes);
    }
  }

  antiquateNewNotes(): void {
    this.oldNotes = { ...this.oldNotes, ...this.newNotes };
    this.newNotes = {};
  }

  private loadFirstEvent(): void {
    this.loadCurrentEvent(Object.keys(this.script.events)[0]);
  }

  private triggerEvent(eventId: string): void {
    this.antiquateNewNotes();

    this.pushCurrentEventToHistory();
    this.loadCurrentEvent(eventId);
  }

  private updateNotes(newNotes: Notes): void {
    Object.keys(newNotes).forEach(key => {
      delete this.oldNotes[key];
      this.newNotes[key] = newNotes[key];
    });
  }

  private pushCurrentEventToHistory(): void {
    this.history.push(this.currentEvent);
  }

  private isSnapshot(arg: any): arg is Snapshot {
    return arg.script !== undefined;
  }
}


export interface Snapshot {
  readonly script: Script;
  readonly currentEvent: EventHappened;
  readonly thought: string;
  readonly oldNotes: Notes;
  readonly newNotes: Notes;
  readonly history: EventHappened[];
}

export interface EventHappened extends Event {
  id: string;
  actionsAvailable: Actions;
  actionsTaken: Actions;
}
