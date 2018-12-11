export class Game {
  readonly script: Script;
  history: ActiveEvent[];
  currentEvent: ActiveEvent;
  oldNotes: Note[];
  newNotes: Note[];

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
      this.oldNotes = [];
      this.newNotes = [];
      this.loadCurrentEvent(this.script.firstEventTitle);
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

  takeAction(action: Action): void {
    this.removeActionFromActionsAvailable(action);
    this.addActionToActionsTaken(action);

    if (action.triggerEventTitle) {
      this.triggerEvent(action.triggerEventTitle);
    }
  }

  triggerNextEvent(): void {
    if (this.currentEvent.nextEventTitle) {
      this.triggerEvent(this.currentEvent.nextEventTitle);
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

  private removeActionFromActionsAvailable(action: Action): void {
    this.removeAction(action.title, this.currentEvent.actionsAvailable);
  }

  private addActionToActionsTaken(action: Action): void {
    this.currentEvent.actionsTaken.push(action);
  }

  private updateNotes(newMemories: Note[]): void {
    newMemories.forEach(newMemory => {
      this.removeExistingMemory(newMemory.title);
      this.newNotes.push({ ...newMemory });
    });
  }

  private antiquateNewNotes(): void {
    this.oldNotes.push(...this.newNotes);
    this.newNotes = [];
  }

  private pushCurrentEventToHistory(): void {
    this.history.push(this.currentEvent);
  }

  private loadCurrentEvent(eventTitle: string): void {
    const eventFromScript = this.getEventFromScript(eventTitle);
    this.currentEvent = {
      ...eventFromScript,
      actionsAvailable: [...(eventFromScript.actions || [])],
      actionsTaken: []
    };
  }

  private removeAction(actionTitle: string, actions: Action[]): void {
    for (let i = 0; i < actions.length; i++) {
      if (actions[i].title === actionTitle) {
        actions.splice(i, 1);
      }
    }
  }

  private removeExistingMemory(memoryTitle: string): void {
    for (let i = 0; i < this.oldNotes.length; i++) {
      if (this.oldNotes[i].title === memoryTitle) {
        this.oldNotes.splice(i, 1);
      }
    }

    for (let i = 0; i < this.newNotes.length; i++) {
      if (this.newNotes[i].title === memoryTitle) {
        this.newNotes.splice(i, 1);
      }
    }
  }

  private getEventFromScript(eventTitle: string): Event {
    for (const event of this.script.events) {
      if (event.title === eventTitle) {
        return event;
      }
    }
  }

  private isSave(arg: any): arg is Save {
    return arg.script !== undefined;
  }
}


export interface Script {
  readonly events: Event[];
  readonly firstEventTitle: string;
}

export interface Save {
  readonly script: Script;
  readonly history: ActiveEvent[];
  readonly currentEvent: ActiveEvent;
  readonly oldNotes: Note[];
  readonly newNotes: Note[];
}

export interface Note {
  readonly title: string;
  readonly description: string;
}

export interface Event {
  readonly title: string;
  readonly description: string;
  readonly actions?: Action[];
  readonly updateNotes?: Note[];
  readonly nextEventTitle?: string;
}

export interface ActiveEvent extends Event {
  actionsAvailable: Action[];
  actionsTaken: Action[];
}

export interface Action {
  readonly title: string;
  readonly openMind?: string;
  readonly triggerEventTitle?: string;
}
