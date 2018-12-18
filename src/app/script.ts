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

export interface Script4Edit {
  // data
  firstEvent: string;
  events: Event4Edit[];
  // helper
  invalid?: boolean;
  firstEventIdNotExist?: boolean;
}

export interface Event4Edit {
  // data
  id: string;
  description: string;
  actions: Action4Edit[];
  notes: Note4Edit[];
  nextEvent: string;
  // helper
  open?: boolean;
  invalid?: boolean;
  duplicateId?: boolean;
  nextEventIdNotExist?: boolean;
}

export interface Action4Edit {
  // data
  description: string;
  think: string;
  triggerEvent: string;
  // helper
  mouseover?: boolean;
  duplicateDescription?: boolean;
  triggerEventIdNotExist?: boolean;
}

export interface Note4Edit {
  // data
  title: string;
  content: string;
  // helper
  mouseover?: boolean;
  duplicateTitle?: boolean;
}

export interface Occurance {
  [key: string]: number;
}

export function buildScript4Edit(script: Script): Script4Edit {
  return {
    // data
    firstEvent: script.firstEvent,
    events: Object.keys(script.events).map(key => {
      return buildEvent4Edit(key, script.events[key]);
    })
  };
}

export function buildScript(script4Edit: Script4Edit): Script {
  return {
    firstEvent: script4Edit.firstEvent,
    events: buildEvents(script4Edit.events)
  };
}

export function validateScript(script: Script4Edit): boolean {
  const eventIdOccurance = countEventIdOccurance(script.events);

  script.firstEventIdNotExist = script.firstEvent && !eventIdOccurance[script.firstEvent];
  const anyInvalidEvent = !validateEvents(script, eventIdOccurance);

  script.invalid = !script.firstEvent || script.firstEventIdNotExist || anyInvalidEvent;

  return !script.invalid;
}

export function sortEvents(events: Event4Edit[], firstEventId: string): Event4Edit[] {
  const sortedEvents: Event4Edit[] = [];
  const eventsMap: { [key: string]: Event4Edit } = {};
  const visited: { [key: string]: boolean } = {};
  events.forEach(event => {
    eventsMap[event.id] = event;
    visited[event.id] = false;
  });

  topoSortEventsHelper(firstEventId, eventsMap, visited, sortedEvents);

  Object.keys(events).forEach(key => {
    if (!visited[key]) {
      topoSortEventsHelper(key, eventsMap, visited, sortedEvents);
    }
  });

  return sortedEvents;
}

function buildEvents(eventsEditable: Event4Edit[]): Events {
  const events: Events = {};
  eventsEditable.forEach(event => {
    events[event.id] = {
      description: event.description,
      actions: event.actions.length > 0 ? buildActions(event.actions) : undefined,
      nextEvent: event.nextEvent || undefined,
      notes: event.notes.length > 0 ? buildNotes(event.notes) : undefined
    };
  });
  return events;
}

function buildEvent4Edit(eventId: string, event: Event): Event4Edit {
  return {
    id: eventId,
    description: event.description,
    nextEvent: event.nextEvent,
    actions: Object.keys(event.actions || {}).map(key => buildAction4Edit(key, event.actions[key])),
    notes: Object.keys(event.notes || {}).map(key => buildNote4Edit(key, event.notes[key])),
    open: false
  };
}

function buildAction4Edit(actionDescription: string, action: Action): Action4Edit {
  return {
    description: actionDescription,
    think: action.think,
    triggerEvent: action.triggerEvent,
    mouseover: false
  };
}

function buildNote4Edit(noteTitle: string, noteContent: string): Note4Edit {
  return {
    title: noteTitle,
    content: noteContent,
    mouseover: false
  };
}


function buildActions(actions4Edit: Action4Edit[]): Actions {
  const actions: Actions = {};
  actions4Edit.forEach(action => {
    actions[action.description] = {
      triggerEvent: action.triggerEvent,
      think: action.think
    };
  });
  return actions;
}

function buildNotes(notes4Edit: Note4Edit[]): Notes {
  const notes: Notes = {};
  notes4Edit.forEach(note => {
    notes[note.title] = note.content;
  });
  return notes;
}


function validateEvents(script: Script4Edit, eventIdOccurance: Occurance): boolean {
  let anyInvalidEvent = false;

  script.events.forEach(event => {
    event.duplicateId = (event.id && eventIdOccurance[event.id] > 1);
    event.nextEventIdNotExist = event.nextEventIdNotExist && !eventIdOccurance[event.nextEvent];
    const anyInvalidAction = !validateActions(event.actions, eventIdOccurance);
    const anyInvalidNote = !validateNotes(event.notes);

    event.invalid = !event.id || event.duplicateId || event.nextEventIdNotExist || anyInvalidAction || anyInvalidNote;

    anyInvalidEvent = anyInvalidEvent || event.invalid;
  });

  return !anyInvalidEvent;
}

function validateActions(actions: Action4Edit[], eventIdOccurance: Occurance): boolean {
  let anyActionInvalid = false;
  const actionDescriptionOccurance: Occurance = actions.reduce(
    (occurance, action) => {
      occurance[action.description] = (occurance[action.description] || 0) + 1;
      return occurance;
    },
    {}
  );

  actions.forEach(action => {
    action.duplicateDescription = actionDescriptionOccurance[action.description] > 1;
    action.triggerEventIdNotExist = action.triggerEvent && !eventIdOccurance[action.triggerEvent];
    anyActionInvalid = anyActionInvalid || !action.description || action.duplicateDescription || action.triggerEventIdNotExist;
  });

  return !anyActionInvalid;
}

function validateNotes(notes: Note4Edit[]): boolean {
  let anyNoteInValid = false;
  const noteTitleOccurance: Occurance = notes.reduce(
    (occurance, note) => {
      occurance[note.title] = (occurance[note.title] || 0) + 1;
      return occurance;
    },
    {}
  );

  notes.forEach(note => {
    note.duplicateTitle = noteTitleOccurance[note.title] > 1;
    anyNoteInValid = anyNoteInValid || !note.title || note.duplicateTitle;
  });

  return !anyNoteInValid;
}

function topoSortEventsHelper(
  eventId: string,
  events: { [key: string]: Event4Edit },
  visited: { [key: string]: boolean },
  stack: Event4Edit[]
): void {
  visited[eventId] = true;
  collectPossibleNextEvents(events[eventId]).forEach(nextEventId => {
    if (!visited[nextEventId]) {
      topoSortEventsHelper(nextEventId, events, visited, stack);
    }
  });
  stack.unshift(events[eventId]);
}

function countEventIdOccurance(events: Event4Edit[]): Occurance {
  const eventIdOccurance: Occurance = {};
  events.forEach(event => {
    eventIdOccurance[event.id] = (eventIdOccurance[event.id] || 0) + 1;
  });
  return eventIdOccurance;
}

function collectPossibleNextEvents(event: Event4Edit): string[] {
  const possibleNextEvents: string[] = [];
  if (event.nextEvent) {
    possibleNextEvents.push(event.nextEvent);
  }
  if (event.actions) {
    event.actions.forEach(action => {
      if (action.triggerEvent) {
        possibleNextEvents.push(action.triggerEvent);
      }
    });
  }
  return possibleNextEvents;
}
