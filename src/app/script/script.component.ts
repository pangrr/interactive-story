import { Component, OnInit } from '@angular/core';
import { Script } from '../game';
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

  constructor() { }

  ngOnInit() {
    this.script = script;
  }
}
