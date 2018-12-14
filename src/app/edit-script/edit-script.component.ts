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
  scriptEditable: ScriptEditable;

  constructor(
    public json: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/delete.svg'));
  }

  ngOnInit() {
    this.scriptEditable = this.script2ScriptEditable(scriptExample);
  }

  openJson(): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '900px',
      data: this.scriptEditable2Script(this.scriptEditable)
    });

    jsonRef.afterClosed().subscribe(result => {
      if (result) {
        this.scriptEditable = this.script2ScriptEditable(result);
      }
    });
  }

  addEvent(): void {
    this.scriptEditable.events.push({
      id: '',
      description: '',
      actions: [],
      nextEvent: '',
      updateNotes: [],
      open: true
    });
  }

  deleteEvent(eventIndex: number): void {
    this.scriptEditable.events.splice(eventIndex, 1);
  }

  addAction(event: EventEditable): void {
    event.actions.push({
      description: '',
      mouseover: false
    });
  }

  addNote(event: EventEditable): void {
    event.updateNotes.push({
      title: '',
      content: '',
      mouseover: false
    });
  }

  deleteAction(event: EventEditable, actionIndex: number): void {
    event.actions.splice(actionIndex, 1);
  }

  deleteNote(event: EventEditable, noteIndex: number): void {
    event.updateNotes.splice(noteIndex, 1);
  }

  collectPossibleNextEvents(event: EventEditable): string[] {
    const possibleNextEvents: string[] = [];
    if (event.nextEvent) {
      possibleNextEvents.push(event.nextEvent);
    }
    if (event.actions) {
      Object.keys(event.actions).forEach(key => {
        const action = event.actions[key];
        if (action.triggerEvent) {
          possibleNextEvents.push(action.triggerEvent);
        }
      });
    }
    return possibleNextEvents;
  }

  sortEvents(): void {
    const sortedEvents: EventEditable[] = [];
    const events: { [key: string]: EventEditable } = {};
    const visited: { [key: string]: boolean } = {};
    this.scriptEditable.events.forEach(event => {
      events[event.id] = event;
      visited[event.id] = false;
    });

    this.topoSortEventsHelper(this.scriptEditable.firstEvent, events, visited, sortedEvents);

    Object.keys(events).forEach(key => {
      if (!visited[key]) {
        this.topoSortEventsHelper(key, events, visited, sortedEvents);
      }
    });

    this.scriptEditable.events = sortedEvents;
  }

  private topoSortEventsHelper(
    eventId: string,
    events: { [key: string]: EventEditable },
    visited: { [key: string]: boolean },
    stack: EventEditable[]
  ): void {
    visited[eventId] = true;
    this.collectPossibleNextEvents(events[eventId]).forEach(nextEventId => {
      if (!visited[nextEventId]) {
        this.topoSortEventsHelper(nextEventId, events, visited, stack);
      }
    });
    stack.unshift(events[eventId]);
  }

  private script2ScriptEditable(script: Script): ScriptEditable {
    return {
      firstEvent: script.firstEvent,
      events: Object.keys(script.events).map(key => {
        return this.event2EventEditable(key, script.events[key]);
      })
    };
  }

  private scriptEditable2Script(scriptEditable: ScriptEditable): Script {
    return {
      firstEvent: scriptEditable.firstEvent,
      events: this.eventsEditable2Events(scriptEditable.events)
    };
  }

  private eventsEditable2Events(eventsEditable: EventEditable[]): Events {
    const events: Events = {};
    eventsEditable.forEach(event => {
      events[event.id] = {
        description: event.description,
        actions: event.actions.length > 0 ? this.actionsEditable2Actions(event.actions) : undefined,
        nextEvent: event.nextEvent || undefined,
        updateNotes: event.updateNotes.length > 0 ? this.notesEditable2Notes(event.updateNotes) : undefined
      };
    });
    return events;
  }

  private event2EventEditable(eventId: string, event: Event): EventEditable {
    return {
      id: eventId,
      description: event.description,
      nextEvent: event.nextEvent,
      actions: Object.keys(event.actions || {}).map(key => this.action2ActionEditable(key, event.actions[key])),
      updateNotes: Object.keys(event.updateNotes || {}).map(key => this.note2NoteEditable(key, event.updateNotes[key])),
      open: false
    };
  }

  private action2ActionEditable(actionDescription: string, action: Action): ActionEditable {
    return {
      description: actionDescription,
      think: action.think,
      triggerEvent: action.triggerEvent,
      mouseover: false
    };
  }

  private note2NoteEditable(noteTitle: string, noteContent: string): NoteEditable {
    return {
      title: noteTitle,
      content: noteContent,
      mouseover: false
    };
  }


  private actionsEditable2Actions(actionsEditable: ActionEditable[]): Actions {
    const actions: Actions = {};
    actionsEditable.forEach(action => {
      actions[action.description] = {
        triggerEvent: action.triggerEvent,
        think: action.think
      };
    });
    return actions;
  }

  private notesEditable2Notes(notesEditable: NoteEditable[]): Notes {
    const notes: Notes = {};
    notesEditable.forEach(note => {
      notes[note.title] = note.content;
    });
    return notes;
  }
}



interface ScriptEditable {
  firstEvent: string;
  events: EventEditable[];
}

interface EventEditable {
  id: string;
  description: string;
  actions?: ActionEditable[];
  updateNotes?: NoteEditable[];
  nextEvent?: string;
  open: boolean;
}

interface ActionEditable {
  description: string;
  think?: string;
  triggerEvent?: string;
  mouseover: boolean;
}

interface NoteEditable {
  title: string;
  content: string;
  mouseover: boolean;
}
