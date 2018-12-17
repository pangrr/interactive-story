export interface Script {
  readonly events: Events;
  readonly firstEvent: string;
}

export interface Event {
  readonly description: string;
  readonly actions?: Actions;
  readonly notes?: Notes;
  readonly nextEvent?: string;
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
