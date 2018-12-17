import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Script, Event, Action, Events, Actions, Notes } from '../script';
import { JsonComponent } from '../json/json.component';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { ScriptService } from '../script.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css']
})
export class EditComponent implements OnInit {
  script: Script4Edit = {
    firstEvent: '0',
    events: [{ id: '0', description: '', actions: [], notes: [], nextEvent: '0' }]
  };

  constructor(
    public json: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private service: ScriptService,
    private router: Router
  ) {
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/delete.svg'));
  }

  ngOnInit() {
    if (this.service.getScript()) {
      this.script = this.buildScript4Edit(this.service.getScript());
    }
  }

  playScript(): void {
    if (this.validateScript()) {
      this.service.setScript(this.buildScript(this.script));
      this.router.navigate(['/play']);
    }
  }

  openScriptJsonEditor(): void {
    if (this.validateScript()) {
      this.openJsonEditor(this.buildScript(this.script), (script: Script) => {
        if (script) {
          this.script = this.buildScript4Edit(script);
        }
      });
    }
  }

  addEvent(): void {
    this.script.events.push({
      // data
      id: undefined,
      description: undefined,
      actions: [],
      nextEvent: undefined,
      notes: [],
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
      think: undefined
    });
  }

  addNote(event: Event4Edit): void {
    event.notes.push({
      title: undefined,
      content: undefined
    });
  }

  deleteAction(event: Event4Edit, actionIndex: number): void {
    event.actions.splice(actionIndex, 1);
  }

  deleteNote(event: Event4Edit, noteIndex: number): void {
    event.notes.splice(noteIndex, 1);
  }


  closeEvents(): void {
    this.script.events.forEach(event => event.open = false);
  }

  sortEvents(): void {
    if (this.validateScript()) {
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
  }

  validateScript(showSnackBarIfValid: boolean = false): boolean {
    const eventIdOccurance = this.countEventIdOccurance();

    this.script.firstEventIdNotExist = this.script.firstEvent && !eventIdOccurance[this.script.firstEvent];
    const anyInvalidEvent = this.validateEvents(this.script, eventIdOccurance);

    this.script.invalid = !this.script.firstEvent || this.script.firstEventIdNotExist || anyInvalidEvent;

    if (this.script.invalid) {
      this.openSnackBar('Invalid Script', true);
    } else if (showSnackBarIfValid) {
      this.openSnackBar('Valid Script');
    }

    return !this.script.invalid;
  }

  private openSnackBar(message: string, warn: boolean = false): void {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: warn ? 'red' : 'green'
    });
  }

  private validateEvents(script: Script4Edit, eventIdOccurance: Occurance): boolean {
    let anyInvalidEvent = false;

    script.events.forEach(event => {
      event.duplicateId = (event.id && eventIdOccurance[event.id] > 1);
      event.nextEventIdNotExist = event.nextEventIdNotExist && !eventIdOccurance[event.nextEvent];
      const anyInvalidAction = this.validateActions(event.actions, eventIdOccurance);
      const anyInvalidNote = this.validateNotes(event.notes);

      event.invalid = !event.id || event.duplicateId || event.nextEventIdNotExist || anyInvalidAction || anyInvalidNote;

      anyInvalidEvent = anyInvalidEvent || event.invalid;
    });

    return anyInvalidEvent;
  }

  private validateActions(actions: Action4Edit[], eventIdOccurance: Occurance): boolean {
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

    return anyActionInvalid;
  }

  private validateNotes(notes: Note4Edit[]): boolean {
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

    return anyNoteInValid;
  }

  private openJsonEditor(data: any, done?: (data: any) => any): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '900px',
      data
    });

    if (done) {
      jsonRef.afterClosed().subscribe(done);
    }
  }

  private countEventIdOccurance(): Occurance {
    const eventIdOccurance: Occurance = {};
    this.script.events.forEach(event => {
      eventIdOccurance[event.id] = (eventIdOccurance[event.id] || 0) + 1;
    });
    return eventIdOccurance;
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
        notes: event.notes.length > 0 ? this.buildNotes(event.notes) : undefined
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
      notes: Object.keys(event.notes || {}).map(key => this.buildNote4Edit(key, event.notes[key])),
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

/* interfaces */

interface Script4Edit {
  // data
  firstEvent: string;
  events: Event4Edit[];
  // helper
  invalid?: boolean;
  firstEventIdNotExist?: boolean;
}

interface Event4Edit {
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

interface Action4Edit {
  // data
  description: string;
  think: string;
  triggerEvent: string;
  // helper
  mouseover?: boolean;
  duplicateDescription?: boolean;
  triggerEventIdNotExist?: boolean;
}

interface Note4Edit {
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
