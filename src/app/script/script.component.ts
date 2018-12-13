import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Script, Event, Action, Events, Actions, Notes } from '../game';
import { JsonComponent } from '../json/json.component';
import * as loveStory from '../../assets/love-story/script.json';
import { not } from '@angular/compiler/src/output/output_ast';

const scriptExample: Script = {
  events: (<any>loveStory).events,
  firstEvent: (<any>loveStory).firstEvent
};


@Component({
  selector: 'app-script',
  templateUrl: 'script.component.html',
  styleUrls: ['script.component.css']
})
export class ScriptComponent implements OnInit {
  scriptEditable: ScriptEditable;

  constructor(public json: MatDialog) { }

  ngOnInit() {
    this.scriptEditable = this.scriptToScriptEditable(scriptExample);
  }

  openJson(): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '900px',
      data: this.scriptEditableToScript(this.scriptEditable)
    });

    jsonRef.afterClosed().subscribe(result => {
      if (result) {
        this.scriptEditable = this.scriptToScriptEditable(result);
      }
    });
  }

  addAction(event: EventEditable): void {
    event.actions.push({
      description: ''
    });
  }

  addNote(event: EventEditable): void {
    event.updateNotes.push({
      title: '',
      content: ''
    });
  }


  private scriptToScriptEditable(script: Script): ScriptEditable {
    return {
      firstEvent: script.firstEvent,
      events: Object.keys(script.events).map(key => {
        return this.eventToEventEditable(key, script.events[key]);
      })
    };
  }

  private eventToEventEditable(eventId: string, event: Event): EventEditable {
    return {
      id: eventId,
      description: event.description,
      nextEvent: event.nextEvent,
      actions: Object.keys(event.actions || {}).map(key => this.actionToActionEditable(key, event.actions[key])),
      updateNotes: Object.keys(event.updateNotes || {}).map(key => this.noteToNoteEditable(key, event.updateNotes[key])),
      open: false
    };
  }

  private actionToActionEditable(actionDescription: string, action: Action): ActionEditable {
    return {
      description: actionDescription,
      openMind: action.openMind,
      triggerEvent: action.triggerEvent
    };
  }

  private noteToNoteEditable(noteTitle: string, noteContent: string): NoteEditable {
    return {
      title: noteTitle,
      content: noteContent
    };
  }

  private scriptEditableToScript(scriptEditable: ScriptEditable): Script {
    return {
      firstEvent: scriptEditable.firstEvent,
      events: this.eventsEditableToEvents(scriptEditable.events)
    };
  }

  private eventsEditableToEvents(eventsEditable: EventEditable[]): Events {
    const events: Events = {};
    eventsEditable.forEach(event => {
      events[event.id] = {
        description: event.description,
        actions: this.actionsEditableToActions(event.actions),
        nextEvent: event.nextEvent,
        updateNotes: this.notesEditableToNotes(event.updateNotes)
      };
    });
    return events;
  }

  private actionsEditableToActions(actionsEditable: ActionEditable[]): Actions {
    const actions: Actions = {};
    actionsEditable.forEach(action => {
      actions[action.description] = {
        triggerEvent: action.triggerEvent,
        openMind: action.openMind
      };
    });
    return actions;
  }

  private notesEditableToNotes(notesEditable: NoteEditable[]): Notes {
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
  openMind?: string;
  triggerEvent?: string;
}

interface NoteEditable {
  title: string;
  content: string;
}
