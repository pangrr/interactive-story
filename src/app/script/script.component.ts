import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Script } from '../game';
import { JsonComponent } from '../json/json.component';
import * as loveStory from '../../assets/love-story/script.json';

const script: Script = {
  events: (<any>loveStory).events,
  firstEvent: (<any>loveStory).firstEvent
};

@Component({
  selector: 'app-script',
  templateUrl: 'script.component.html',
  styleUrls: ['script.component.css']
})
export class ScriptComponent implements OnInit {
  script: Script;

  constructor(
    public json: MatDialog,

  ) { }

  ngOnInit() {
    this.script = script;
  }

  openJson(): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '900px',
      data: this.script
    });

    jsonRef.afterClosed().subscribe(result => {
      if (result) {
        this.script = result;
      }
    });
  }

  addAction(eventKey: string): void {
    const event = this.script.events[eventKey];
    if (!event.actions) {
      event.actions = {};
    }

    event.actions[''] = {};
  }

  addNote(event: string): void {

  }
}
