import { Injectable } from '@angular/core';
import { Script, Events } from './game';
import * as loveStory from '../assets/love-story/script.json';

const script: Script = {
  events: (<any>loveStory).events,
  firstEvent: (<any>loveStory).firstEvent
};

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  getScript(): Script {
    const validationResult = this.validateScript(script);

    if (validationResult.isValid) {
      return script;
    } else {
      return this.invalidScript(validationResult.error);
    }
  }

  private invalidScript(description: string): Script {
    return {
      events: {
        _: {
          description
        }
      },
      firstEvent: '_'
    };
  }

  private validateScript(script: Script): ValidationResult {
    const triggeredEventsMissing = this.getMissingTriggeredEvents(script.events);

    if (triggeredEventsMissing.length === 0) {
      return { isValid: true };
    } else {
      return { isValid: false, error: `missing next event titles:\n${triggeredEventsMissing.join('\n')}\n` };
    }
  }

  private getMissingTriggeredEvents(events: Events): string[] {
    const missingTriggetedEvents: string[] = [];

    Object.keys(events).forEach(eventKey => {
      const event = events[eventKey];
      if (event.actions) {
        Object.keys(event.actions).forEach(actionKey => {
          const action = event.actions[actionKey];
          if (action.triggerEvent) {
            if (!events[action.triggerEvent]) {
              missingTriggetedEvents.push(action.triggerEvent);
            }
          }
        });
      }
    });

    return missingTriggetedEvents;
  }
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}
