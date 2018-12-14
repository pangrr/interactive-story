export class StoryPlayable {
  readonly script: Script;
  history: EventHappened[];
  currentEvent: EventHappened;
  oldNotes: Notes;
  newNotes: Notes;

  constructor(source: Save | Script) {
    if (this.isSave(source)) {
      this.script = source.script;
      this.history = source.history;
      this.oldNotes = source.oldNotes;
      this.newNotes = source.newNotes;
      this.currentEvent = source.currentEvent;
    } else {
      this.script = source;
      this.history = [];
      this.oldNotes = {};
      this.newNotes = {};
      this.loadCurrentEvent(this.script.firstEvent);
      if (this.currentEvent.updateNotes) {
        this.updateNotes(this.currentEvent.updateNotes);
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
    if (this.currentEvent.updateNotes) {
      this.updateNotes(this.currentEvent.updateNotes);
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


export interface Script {
  readonly events: Events;
  readonly firstEvent: string;
}

export interface Save {
  readonly script: Script;
  readonly history: EventHappened[];
  readonly currentEvent: EventHappened;
  readonly oldNotes: Notes;
  readonly newNotes: Notes;
}

export interface Event {
  readonly description: string;
  readonly actions?: Actions;
  readonly updateNotes?: Notes;
  readonly nextEvent?: string;
}

export interface EventHappened extends Event {
  actionsAvailable: Actions;
  actionsTaken: string[];
}

export interface Action {
  readonly think?: string;
  readonly triggerEvent?: string;
}

export interface Actions {
  [key: string]: Action;
}

export interface Events {
  [key: string]: Event;
}

export interface Notes {
  [key: string]: string;
}
