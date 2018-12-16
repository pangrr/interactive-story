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
      data: this.scriptFormGroupToScript(this.scriptFormGroup)
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
      triggerEvent: new FormControl(''),
      think: new FormControl(''),
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

  collectPossibleNextEventIds(event: FormGroup): string[] {
    const possibleNextEvents: string[] = [];
    const nextEvent = event.get('nextEvent').value;

    if (nextEvent) {
      possibleNextEvents.push(nextEvent);
    }

    const actions = (event.get('actions') as FormArray);
    actions.controls.forEach(action => {
      const triggerEvent = action.get('triggerEvent').value;
      if (triggerEvent) {
        possibleNextEvents.push(triggerEvent);
      }
    });

    return possibleNextEvents;
  }

  closeEvents(): void {
    (this.scriptFormGroup.get('events') as FormArray).controls.forEach(eventControlGroup => eventControlGroup.get('open').setValue(false));
  }

  sortEvents(): void {
    const sortedEventsFormArray: FormArray = new FormArray([]);
    const eventFormGroupMap: { [key: string]: FormGroup } = {};
    const visitedEventIdMap: { [key: string]: boolean } = {};
    (this.scriptFormGroup.get('events') as FormArray).controls.forEach((eventControlGroup: FormGroup) => {
      const eventId: string = eventControlGroup.get('id').value;
      eventFormGroupMap[eventId] = eventControlGroup;
      visitedEventIdMap[eventId] = false;
    });

    this.topoSortEventsHelper(this.scriptFormGroup.get('firstEvent').value, eventFormGroupMap, visitedEventIdMap, sortedEventsFormArray);

    Object.keys(eventFormGroupMap).forEach(eventId => {
      if (!visitedEventIdMap[eventId]) {
        this.topoSortEventsHelper(eventId, eventFormGroupMap, visitedEventIdMap, sortedEventsFormArray);
      }
    });

    this.scriptFormGroup.setValue({ 'events': sortedEventsFormArray });
  }

  private topoSortEventsHelper(
    eventId: string,
    eventControlGroupMap: { [key: string]: FormGroup },
    visitedEventIdMap: { [key: string]: boolean },
    eventsFormArray: FormArray
  ): void {
    visitedEventIdMap[eventId] = true;
    this.collectPossibleNextEventIds(eventControlGroupMap[eventId]).forEach(nextEventId => {
      if (!visitedEventIdMap[nextEventId]) {
        this.topoSortEventsHelper(nextEventId, eventControlGroupMap, visitedEventIdMap, eventsFormArray);
      }
    });
    eventsFormArray.insert(0, eventControlGroupMap[eventId]);
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
    // TODO
    return null;
  }

  private scriptFormGroupToScript(scriptFormGroup: FormGroup): Script {
    return {
      firstEvent: scriptFormGroup.get('value').value,
      events: this.eventsFormArrayToEvents(scriptFormGroup.get('events') as FormArray)
    };
  }

  private eventsFormArrayToEvents(eventsFormArray: FormArray): Events {
    const events: Events = {};
    eventsFormArray.controls.forEach((eventFormGroup: FormGroup) => {
      events[eventFormGroup.get('id').value] = {
        description: eventFormGroup.get('description').value,
        actions: (eventFormGroup.get('actions') as FormArray).length > 0 ?
          this.actionsFormArrayToActions(eventFormGroup.get('actions') as FormArray) : undefined,
        nextEvent: eventFormGroup.get('nextEvent').value || undefined,
        updateNotes: (eventFormGroup.get('updateNotes') as FormArray).length > 0 ?
          this.notesFormArrayToNotes(eventFormGroup.get('updateNotes') as FormArray) : undefined
      };
    });
    return events;
  }

  private buildEventFormGroup(eventId: string, event: Event): FormGroup {
    return new FormGroup({
      id: new FormControl(eventId),
      description: new FormControl(event.description),
      nextEvent: new FormControl(event.nextEvent),
      actions: new FormArray(Object.keys(event.actions || {}).map(key => this.buildActionFormGroup(key, event.actions[key]))),
      updateNotes: new FormArray(Object.keys(event.updateNotes || {}).map(key => this.buildNoteFormGroup(key, event.updateNotes[key])))
    });
  }

  private buildActionFormGroup(actionDescription: string, action: Action): FormGroup {
    return new FormGroup({
      description: new FormControl(actionDescription),
      think: new FormControl(action.think),
      triggerEvent: new FormControl(action.triggerEvent)
    });
  }

  private buildNoteFormGroup(noteTitle: string, noteContent: string): FormGroup {
    return new FormGroup({
      title: new FormControl(noteTitle),
      content: new FormControl(noteContent),
      mouseover: new FormControl(false)
    });
  }


  private actionsFormArrayToActions(actionsFormArray: FormArray): Actions {
    const actions: Actions = {};
    actionsFormArray.controls.forEach((actionFormGroup: FormGroup) => {
      actions[actionFormGroup.get('description').value] = {
        triggerEvent: actionFormGroup.get('triggerEvent').value || undefined,
        think: actionFormGroup.get('think').value || undefined
      };
    });
    return actions;
  }

  private notesFormArrayToNotes(notesFormArray: FormArray): Notes {
    const notes: Notes = {};
    notesFormArray.controls.forEach((noteFormGroup: FormGroup) => {
      notes[noteFormGroup.get('title').value] = noteFormGroup.get('content').value;
    });
    return notes;
  }
}
