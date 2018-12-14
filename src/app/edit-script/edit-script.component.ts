import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Script, Event, Action, Events, Actions, Notes } from '../story-playable';
import { JsonComponent } from '../json/json.component';
import * as loveStory from '../../assets/love-story/script.json';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormArray, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

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
  scriptFormGroup: FormGroup;
  errorStateMatcher = new MyErrorStateMatcher();

  constructor(
    public json: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/delete.svg'));
  }

  ngOnInit() {
    this.scriptFormGroup = this.buildScriptFormGroup(scriptExample);
  }

  openJson(): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '900px',
      data: this.scriptEditable2Script(this.scriptFormGroup)
    });

    jsonRef.afterClosed().subscribe(result => {
      if (result) {
        this.scriptFormGroup = this.buildScriptFormGroup(result);
      }
    });
  }

  addEvent(): void {
    (this.scriptFormGroup.get('events') as FormArray).push(new FormGroup({
      id: new FormControl(''),
      description: new FormControl(''),
      actions: new FormArray([]),
      nextEvent: new FormControl(''),
      updateNotes: new FormArray([]),
      open: new FormControl(true)
    }));
  }

  deleteEvent(i: number): void {
    (this.scriptFormGroup.get('events') as FormArray).removeAt(i);
  }

  addAction(actions: FormArray): void {
    actions.push(new FormGroup({
      description: new FormControl(''),
      mouseover: new FormControl(false)
    }));
  }

  addNote(notes: FormArray): void {
    notes.push(new FormGroup({
      title: new FormControl(''),
      content: new FormControl(''),
      mouseover: new FormControl(false)
    }));
  }

  collectPossibleNextEvents(event: FormGroup): string[] {
    const possibleNextEvents: string[] = [];
    if (event.get('nextEvent')) {
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

  closeEvents(): void {
    this.scriptFormGroup.events.forEach(event => event.open = false);
  }

  sortEvents(): void {
    const sortedEvents: EventEditable[] = [];
    const events: { [key: string]: EventEditable } = {};
    const visited: { [key: string]: boolean } = {};
    this.scriptFormGroup.events.forEach(event => {
      events[event.id] = event;
      visited[event.id] = false;
    });

    this.topoSortEventsHelper(this.scriptFormGroup.firstEvent, events, visited, sortedEvents);

    Object.keys(events).forEach(key => {
      if (!visited[key]) {
        this.topoSortEventsHelper(key, events, visited, sortedEvents);
      }
    });

    this.scriptFormGroup.events = sortedEvents;
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

  private buildScriptFormGroup(script: Script): FormGroup {
    return new FormGroup({
      firstEvent: new FormControl(script.firstEvent),
      events: new FormArray(
        Object.keys(script.events).map(
          key => this.buildEventFormGroup(key, script.events[key])
        )
      )
    }, { validators: this.formValidator });
  }

  private formValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    return null;
  }

  private scriptEditable2Script(scriptEditable: FormGroup): Script {
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

  private buildEventFormGroup(eventId: string, event: Event): FormGroup {
    return new FormGroup({
      id: new FormControl(eventId),
      description: new FormControl(event.description),
      nextEvent: new FormControl(event.nextEvent),
      actions: Object.keys(event.actions || {}).map(key => this.buildActionFormGroup(key, event.actions[key])),
      updateNotes: Object.keys(event.updateNotes || {}).map(key => this.buildNoteFormGroup(key, event.updateNotes[key]))
    });
  }

  private buildActionFormGroup(actionDescription: string, action: Action): FormGroup {
    return new FormGroup({
      description: new FormControl(actionDescription),
      think: new FormControl(action.think),
      triggerEvent: new FormControl(action.triggerEvent)
    });
  }

  private buildNoteFormGroup(noteTitle: string, noteContent: string): NoteEditable {
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
