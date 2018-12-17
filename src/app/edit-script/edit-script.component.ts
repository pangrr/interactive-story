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

  openJson(): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '900px',
      data: this.buildScript(this.script)
    });

    jsonRef.afterClosed().subscribe(result => {
      if (result) {
        this.script = this.buildScript4Edit(result);
      }
    });
  }

  addEvent(): void {
    this.script.events.push({
      // data
      id: '',
      description: '',
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
      description: '',
      triggerEvent: '',
      think: '',
      // helper
      mouseover: false
    });
  }

  addNote(event: Event4Edit): void {
    event.updateNotes.push({
      // data
      title: '',
      content: '',
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

  private getDuplicateEventIds(): { [key: string]: boolean } {
    const eventIds: { [key: string]: boolean } = {};
    const duplicateEventIds: { [key: string]: boolean } = {};
    this.script.events.forEach(event => {
      const id = event.id;
      if (!eventIds[id]) {
        eventIds[id] = true;
      } else {
        duplicateEventIds[id] = true;
      }
    });
    return duplicateEventIds;
  }

  private getDuplicateActionDescriptions(actions: Action4Edit[]): { [key: string]: boolean } {
    const actionDescriptions: { [key: string]: boolean } = {};
    const duplicateActionDescriptions: { [key: string]: boolean } = {};
    actions.forEach(action => {
      const description = action.description;
      if (!actionDescriptions[description]) {
        actionDescriptions[description] = true;
      } else {
        duplicateActionDescriptions[description] = true;
      }
    });
    return duplicateActionDescriptions;
  }

  private getDuplicateNoteTitles(notes: Note4Edit[]): { [key: string]: boolean } {
    const noteTitles: { [key: string]: boolean } = {};
    const duplicateNoteTitles: { [key: string]: boolean } = {};
    notes.forEach(note => {
      const title = note.title;
      if (!noteTitles[title]) {
        noteTitles[title] = true;
      } else {
        duplicateNoteTitles[title] = true;
      }
    });
    return duplicateNoteTitles;
  }

  eventIdExists(eventId: string): boolean {
    console.log('eventIdExists', eventId);
    for (const event of this.script.events) {
      if (event.id === eventId) {
        return true;
      }
    }
    return false;
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
