import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Script, Event, Action, Events, Actions, Notes } from '../story-playable';
import { JsonComponent } from '../json/json.component';
import * as loveStory from '../../assets/love-story/script.json';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';


const scriptExample: Script = {
  events: (<any>loveStory).events,
  firstEvent: (<any>loveStory).firstEvent
};


@Component({
  selector: 'app-edit-script',
  templateUrl: 'edit-script.component.html',
  styleUrls: ['edit-script.component.css']
})
export class EditScriptComponent implements OnInit {
  script: Script4Edit;

  constructor(
    public json: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/delete.svg'));
  }

  ngOnInit() {
    this.script = this.buildScript4Edit(scriptExample);
  }

  showScriptJson(): void {
    this.showJson(this.buildScript(this.script), (script: Script) => {
      if (script) {
        this.script = this.buildScript4Edit(script);
      }
    });
  }

  addEvent(): void {
    this.script.events.push({
      // data
      id: undefined,
      description: undefined,
      actions: [],
      nextEvent: undefined,
      updateNotes: [],
      // helper
      open: true
    });
  }

  deleteEvent(eventIndex: number): void {
    this.script.events.splice(eventIndex, 1);
  }

  addAction(event: Event4Edit): void {
    event.actions.push({
      // data
      description: undefined,
      triggerEvent: undefined,
      think: undefined,
      // helper
      mouseover: false
    });
  }

  addNote(event: Event4Edit): void {
    event.updateNotes.push({
      // data
      title: undefined,
      content: undefined,
      // helper
      mouseover: false
    });
  }

  deleteAction(event: Event4Edit, actionIndex: number): void {
    event.actions.splice(actionIndex, 1);
  }

  deleteNote(event: Event4Edit, noteIndex: number): void {
    event.updateNotes.splice(noteIndex, 1);
  }


  closeEvents(): void {
    this.script.events.forEach(event => event.open = false);
  }

  sortEvents(): void {
    const sortedEvents: Event4Edit[] = [];
    const events: { [key: string]: Event4Edit } = {};
    const visited: { [key: string]: boolean } = {};
    this.script.events.forEach(event => {
      events[event.id] = event;
      visited[event.id] = false;
    });

    this.topoSortEventsHelper(this.script.firstEvent, events, visited, sortedEvents);

    Object.keys(events).forEach(key => {
      if (!visited[key]) {
        this.topoSortEventsHelper(key, events, visited, sortedEvents);
      }
    });

    this.script.events = sortedEvents;
  }

  validateScript(): void {
    const eventIdOccurance = this.countEventIdOccurance();

    const invalidScript: InvalidScript = {};

    if (!eventIdOccurance[this.script.firstEvent]) {
      invalidScript.firstEventNotExists = this.script.firstEvent;
    }

    const duplicateEventIds = Object.keys(eventIdOccurance).reduce((eventIds, eventId) => {
      if (eventIdOccurance[eventId] > 1) {
        return [...eventIds, eventId];
      } else {
        return eventIds;
      }
    }, []);
    if (duplicateEventIds.length > 0) {
      invalidScript.duplicateEventIds = duplicateEventIds;
    }

    const invalidEvents: InvalidEvent[] = [];

    this.script.events.forEach(event => {
      const invalidEvent: InvalidEvent = { id: event.id };
      if (!eventIdOccurance[event.nextEvent]) {
        invalidEvent.nextEventNotExists = event.nextEvent;
      }

      const duplicateActionDescriptions = this.getDuplicateActionDescriptions(event.actions);
      if (duplicateActionDescriptions.length > 0) {
        invalidEvent.duplicateActionDescriptions = duplicateActionDescriptions;
      }

      const duplicateNoteTitles = this.getDuplicateNoteTitles(event.updateNotes);
      if (duplicateNoteTitles.length > 0) {
        invalidEvent.duplicateNoteTitles = duplicateNoteTitles;
      }

      const invalidActions: InvalidAction[] = [];
      event.actions.forEach(action => {
        if (!eventIdOccurance[action.triggerEvent]) {
          invalidActions.push({
            description: action.description,
            triggerEventNotExists: action.triggerEvent
          });
        }
      });
      if (invalidActions.length > 0) {
        invalidEvent.invalidActions = invalidActions;
      }

      const invalidNotes: InvalidNote[] = [];
      event.updateNotes.forEach(note => {
        if (!note.title) {
          invalidNotes.push({
            
          })
        }
      })

      if (Object.keys(invalidEvent).length > 1) {
        invalidEvents.push(invalidEvent);
      }
    });

    if (invalidEvents.length > 0) {
      invalidScript.invalidEvents = invalidEvents;
    }

    this.showJson(invalidScript);
  }

  private showJson(object: any, done?: (data: any) => any): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '900px',
      data: { object, showSubmit: done !== undefined }
    });

    if (done) {
      jsonRef.afterClosed().subscribe(done);
    }
  }

  private countEventIdOccurance(): { [key: string]: number } {
    const eventIds: { [key: string]: number } = {};
    this.script.events.forEach(event => {
      eventIds[event.id] = (eventIds[event.id] || 0) + 1;
    });
    return eventIds;
  }

  private collectPossibleNextEvents(event: Event4Edit): string[] {
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

  private getDuplicateActionDescriptions(actions: Action4Edit[]): string[] {
    const actionDescriptions: { [key: string]: boolean } = {};
    const duplicateActionDescriptions: string[] = [];
    actions.forEach(action => {
      const description = action.description;
      if (!actionDescriptions[description]) {
        actionDescriptions[description] = true;
      } else {
        duplicateActionDescriptions.push(description);
      }
    });
    return duplicateActionDescriptions;
  }

  private getDuplicateNoteTitles(notes: Note4Edit[]): string[] {
    const noteTitles: { [key: string]: boolean } = {};
    const duplicateNoteTitles: string[] = [];
    notes.forEach(note => {
      const title = note.title;
      if (!noteTitles[title]) {
        noteTitles[title] = true;
      } else {
        duplicateNoteTitles.push(title);
      }
    });
    return duplicateNoteTitles;
  }

  private topoSortEventsHelper(
    eventId: string,
    events: { [key: string]: Event4Edit },
    visited: { [key: string]: boolean },
    stack: Event4Edit[]
  ): void {
    visited[eventId] = true;
    this.collectPossibleNextEvents(events[eventId]).forEach(nextEventId => {
      if (!visited[nextEventId]) {
        this.topoSortEventsHelper(nextEventId, events, visited, stack);
      }
    });
    stack.unshift(events[eventId]);
  }

  private buildScript4Edit(script: Script): Script4Edit {
    return {
      // data
      firstEvent: script.firstEvent,
      events: Object.keys(script.events).map(key => {
        return this.buildEvent4Edit(key, script.events[key]);
      })
    };
  }

  private buildScript(script4Edit: Script4Edit): Script {
    return {
      firstEvent: script4Edit.firstEvent,
      events: this.buildEvents(script4Edit.events)
    };
  }

  private buildEvents(eventsEditable: Event4Edit[]): Events {
    const events: Events = {};
    eventsEditable.forEach(event => {
      events[event.id] = {
        description: event.description,
        actions: event.actions.length > 0 ? this.buildActions(event.actions) : undefined,
        nextEvent: event.nextEvent || undefined,
        updateNotes: event.updateNotes.length > 0 ? this.buildNotes(event.updateNotes) : undefined
      };
    });
    return events;
  }

  private buildEvent4Edit(eventId: string, event: Event): Event4Edit {
    return {
      id: eventId,
      description: event.description,
      nextEvent: event.nextEvent,
      actions: Object.keys(event.actions || {}).map(key => this.buildAction4Edit(key, event.actions[key])),
      updateNotes: Object.keys(event.updateNotes || {}).map(key => this.buildNote4Edit(key, event.updateNotes[key])),
      open: false
    };
  }

  private buildAction4Edit(actionDescription: string, action: Action): Action4Edit {
    return {
      description: actionDescription,
      think: action.think,
      triggerEvent: action.triggerEvent,
      mouseover: false
    };
  }

  private buildNote4Edit(noteTitle: string, noteContent: string): Note4Edit {
    return {
      title: noteTitle,
      content: noteContent,
      mouseover: false
    };
  }


  private buildActions(actions4Edit: Action4Edit[]): Actions {
    const actions: Actions = {};
    actions4Edit.forEach(action => {
      actions[action.description] = {
        triggerEvent: action.triggerEvent,
        think: action.think
      };
    });
    return actions;
  }

  private buildNotes(notes4Edit: Note4Edit[]): Notes {
    const notes: Notes = {};
    notes4Edit.forEach(note => {
      notes[note.title] = note.content;
    });
    return notes;
  }
}



interface Script4Edit {
  // data
  firstEvent: string;
  events: Event4Edit[];
}

interface Event4Edit {
  // data
  id: string;
  description: string;
  actions: Action4Edit[];
  updateNotes: Note4Edit[];
  nextEvent: string;
  // helper
  open: boolean;
}

interface Action4Edit {
  // data
  description: string;
  think: string;
  triggerEvent: string;
  // helper
  mouseover: boolean;
}

interface Note4Edit {
  // data
  title: string;
  content: string;
  // helper
  mouseover: boolean;
}

interface InvalidScript {
  firstEventNotExists?: string;
  firstEventUndefined?: boolean;
  duplicateEventIds?: string[];
  invalidEvents?: InvalidEvent[];
}

interface InvalidEvent {
  id: string;
  idUndefined?: boolean;
  nextEventNotExists?: string;
  duplicateNoteTitles?: string[];
  duplicateActionDescriptions?: string[];
  invalidActions?: InvalidAction[];
}

interface InvalidAction {
  description: string;
  descriptionUndefined?: boolean;
  triggerEventNotExists: string;
}

interface InvalidNote {
  title: string;
  titleUndefined?: boolean;
}
