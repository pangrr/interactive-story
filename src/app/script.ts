export interface Script {
  readonly events: Events;
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
  events: Event4Edit[];
  // helper
  invalid?: boolean;
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
  triggeredEventIdsNotExist?: string[];
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

interface Occurance {
  [key: string]: number;
}

interface InvalidScript {
  invalidJson: boolean;
  eventsInvalidType: boolean;
  eventsOfInvalidType: string[];
  eventsWithDescriptionOfInvalidType: string[];
  eventsWithActionsOfInvalidType: string[];
  eventsWithNotesOfInvalidType: string[];
  eventsWithNextEventOfInvalidType: string[];
  eventsWithNextEventNotExist: string[];
  actionsWithThinkOfInvalidType: string[];
  actionsWithTriggerEventOfInvalidType: string[];
  actionsWithTriggerEventNotExist: string[];
  notesOfInvalidType: string[];
}

export function buildScript4Edit(script: Script): Script4Edit {
  return {
    events: Object.keys(script.events).map(key => {
      return buildEvent4Edit(key, script.events[key]);
    })
  };
}

export function buildScript(script4Edit: Script4Edit): Script {
  return {
    events: buildEvents(script4Edit.events)
  };
}

export function validateScript4Edit(script: Script4Edit): boolean {
  const eventIdOccurance = countEventIdOccurance(script.events);
  script.invalid = !validateEvents4Edit(script, eventIdOccurance);
  return !script.invalid;
}

export function sortEvents(events: Event4Edit[]): Event4Edit[] {
  const sortedEvents: Event4Edit[] = [];
  const eventsMap: { [key: string]: { event: Event4Edit, visited: boolean } } = {};
  events.forEach(event => eventsMap[event.id] = { event, visited: false });

  events.forEach(event => {
    if (!eventsMap[event.id].visited) {
      topoSortEventsHelper(event.id, eventsMap, sortedEvents);
    }
  });

  return sortedEvents;
}

export function validateScript(scriptString: string): InvalidScript {
  let script: Script;
  const invalid: InvalidScript = {
    invalidJson: false,
    eventsInvalidType: false,
    eventsOfInvalidType: [],
    eventsWithDescriptionOfInvalidType: [],
    eventsWithActionsOfInvalidType: [],
    eventsWithNotesOfInvalidType: [],
    eventsWithNextEventOfInvalidType: [],
    eventsWithNextEventNotExist: [],
    actionsWithThinkOfInvalidType: [],
    actionsWithTriggerEventOfInvalidType: [],
    actionsWithTriggerEventNotExist: [],
    notesOfInvalidType: []
  };

  try {
    script = JSON.parse(scriptString);
  } catch (e) {
    invalid.invalidJson = true;
    return invalid;
  }

  const events = script.events;

  if (!isObject(events)) {
    invalid.eventsInvalidType = true;
  }

  if (!invalid.eventsInvalidType) {
    Object.keys(events).forEach(eventId => {
      const event = events[eventId];
      if (!isObject(event)) {
        invalid.eventsOfInvalidType.push(eventId);
      } else {
        if (typeof event.description !== 'string') {
          invalid.eventsWithDescriptionOfInvalidType.push(eventId);
        }
        if (!(event.nextEvent === undefined || typeof event.nextEvent === 'string')) {
          invalid.eventsWithNextEventOfInvalidType.push(eventId);
        }
        if (typeof event.nextEvent === 'string') {
          if (events[event.nextEvent] === undefined) {
            invalid.eventsWithNextEventNotExist.push(eventId);
          }
        }

        const actions = event.actions;
        const notes = event.notes;

        if (!(actions === undefined || isObject(actions))) {
          invalid.eventsWithActionsOfInvalidType.push(eventId);
        }
        if (!(notes === undefined || isObject(notes))) {
          invalid.eventsWithNotesOfInvalidType.push(eventId);
        }

        if (isObject(actions)) {
          Object.keys(actions).forEach(actionDescription => {
            const action = actions[actionDescription];
            const think = action.think;
            const triggerEvent = action.triggerEvent;

            if (!(think === undefined || typeof think === 'string')) {
              invalid.actionsWithThinkOfInvalidType.push(`${eventId} | ${actionDescription}`);
            }
            if (!(triggerEvent === undefined || typeof triggerEvent === 'string')) {
              invalid.actionsWithTriggerEventOfInvalidType.push(`${eventId} | ${actionDescription}`);
            }
            if (typeof triggerEvent === 'string') {
              if (events[triggerEvent] === undefined) {
                invalid.actionsWithTriggerEventNotExist.push(`${eventId} | ${actionDescription}`);
              }
            }
          });
        }

        if (isObject(notes)) {
          Object.keys(notes).forEach(noteTitle => {
            const note = notes[noteTitle];

            if (typeof note !== 'string') {
              invalid.notesOfInvalidType.push(`${eventId} | ${noteTitle}`);
            }
          });
        }
      }
    });
  }

  return invalid;
}

function isObject(x: any): boolean {
  return typeof x === 'object' && x.constructor === {}.constructor;
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

function collectPossibleNextEvents(event: Event4Edit): string[] {
  const possibleNextEvents: string[] = [];
  if (event.nextEvent) {
    possibleNextEvents.push(event.nextEvent);
  }
  if (event.actions) {
    event.actions.forEach(action => {
      if (action.triggerEvent && !possibleNextEvents.includes(action.triggerEvent)) {
        possibleNextEvents.push(action.triggerEvent);
      }
    });
  }
  return possibleNextEvents;
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
      triggerEvent: action.triggerEvent || undefined,
      think: action.think || undefined
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


function validateEvents4Edit(script: Script4Edit, eventIdOccurance: Occurance): boolean {
  let anyInvalidEvent = false;

  script.events.forEach(event => {
    event.triggeredEventIdsNotExist = [];
    event.duplicateId = (event.id && eventIdOccurance[event.id] > 1);
    event.nextEventIdNotExist = event.nextEvent && !eventIdOccurance[event.nextEvent];
    if (event.nextEventIdNotExist) {
      event.triggeredEventIdsNotExist.push(event.nextEvent);
    }
    const anyInvalidAction = !validateActions4Edit(event.actions, eventIdOccurance, event.triggeredEventIdsNotExist);
    const anyInvalidNote = !validateNotes4Edit(event.notes);

    event.invalid = !event.id || event.duplicateId || event.nextEventIdNotExist || anyInvalidAction || anyInvalidNote;

    anyInvalidEvent = anyInvalidEvent || event.invalid;
  });

  return !anyInvalidEvent;
}

function validateActions4Edit(actions: Action4Edit[], eventIdOccurance: Occurance, triggeredEventIdsNotExist: string[]): boolean {
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
    if (action.triggerEventIdNotExist) {
      triggeredEventIdsNotExist.push(action.triggerEvent);
    }
    anyActionInvalid = anyActionInvalid || !action.description || action.duplicateDescription || action.triggerEventIdNotExist;
  });

  return !anyActionInvalid;
}

function validateNotes4Edit(notes: Note4Edit[]): boolean {
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
  eventsMap: { [key: string]: { event: Event4Edit, visited: boolean } },
  stack: Event4Edit[]
): void {
  eventsMap[eventId].visited = true;
  collectPossibleNextEvents(eventsMap[eventId].event).forEach(nextEventId => {
    if (!eventsMap[nextEventId].visited) {
      topoSortEventsHelper(nextEventId, eventsMap, stack);
    }
  });
  stack.unshift(eventsMap[eventId].event);
}

function countEventIdOccurance(events: Event4Edit[]): Occurance {
  const eventIdOccurance: Occurance = {};
  events.forEach(event => {
    eventIdOccurance[event.id] = (eventIdOccurance[event.id] || 0) + 1;
  });
  return eventIdOccurance;
}
