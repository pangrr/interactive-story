export class Game {
  readonly script: Script;
  history: ActiveEvent[];
  currentEvent: ActiveEvent;
  oldMemories: Memory[];
  recentMemories: Memory[];

  constructor(source: Save | Script) {
    if ('script' in source) {
      this.script = source.script;
      this.history = source.history;
      this.oldMemories = source.oldMemories;
      this.recentMemories = source.recentMemories;
      this.currentEvent = source.currentEvent;
    } else {
      this.script = source;
      this.history = [];
      this.oldMemories = [];
      this.recentMemories = [];
      this.loadCurrentEvent(this.script.firstEvent);
      if (this.currentEvent.updateMemories) {
        this.updateMemories(this.currentEvent.updateMemories);
      }
    }
  }

  save(): Save {
    return {
      script: this.script,
      history: this.history,
      currentEvent: this.currentEvent,
      oldMemories: this.oldMemories,
      recentMemories: this.recentMemories
    };
  }

  takeAction(action: Action): void {
    this.antiquateRecentMemories();

    this.removeAction(action.title, this.currentEvent.actionsAvailable);
    this.currentEvent.actionsTaken.push(action);

    if (action.recallMemories) {
      this.updateMemories(action.recallMemories);
    }

    if (action.triggerEvent) {
      this.triggerEvent(action.triggerEvent);
    }
  }

  private updateMemories(newMemories: Memory[]): void {
    newMemories.forEach(newMemory => {
      this.removeExistingMemory(newMemory.title);
      this.recentMemories.push({ ...newMemory });
    });
  }

  private triggerEvent(eventTitle: string): void {
    this.pushCurrentEventToHistory();
    this.loadCurrentEvent(eventTitle);
    if (this.currentEvent.updateMemories) {
      this.updateMemories(this.currentEvent.updateMemories);
    }
  }

  private antiquateRecentMemories(): void {
    this.oldMemories.push(...this.recentMemories);
    this.recentMemories = [];
  }

  private pushCurrentEventToHistory(): void {
    this.history.push(this.currentEvent);
  }

  private loadCurrentEvent(eventTitle: string): void {
    const eventFromScript = this.getEventFromScript(eventTitle);
    this.currentEvent = {
      ...eventFromScript,
      actionsAvailable: [...eventFromScript.actions],
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
    for (let i = 0; i < this.oldMemories.length; i++) {
      if (this.oldMemories[i].title === memoryTitle) {
        this.oldMemories.splice(i, 1);
      }
    }

    for (let i = 0; i < this.recentMemories.length; i++) {
      if (this.recentMemories[i].title === memoryTitle) {
        this.recentMemories.splice(i, 1);
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
}


export interface Script {
  readonly events: Event[];
  readonly firstEvent: string;
}

export interface Save {
  readonly script: Script;
  readonly history: ActiveEvent[];
  readonly currentEvent: ActiveEvent;
  readonly oldMemories: Memory[];
  readonly recentMemories: Memory[];
}

export interface Memory {
  readonly title: string;
  readonly description: string;
}

export interface Event {
  readonly title: string;
  readonly description: string;
  readonly actions: Action[];
  readonly updateMemories?: Memory[];
}

export interface ActiveEvent extends Event {
  actionsAvailable: Action[];
  actionsTaken: Action[];
}

export interface Action {
  readonly title: string;
  readonly recallMemories?: Memory[]; // display memories, add or update these memories
  readonly triggerEvent?: string;
}
