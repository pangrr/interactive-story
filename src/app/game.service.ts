import { Injectable } from '@angular/core';
import { Script, Event, Action } from './game';
import { loveStory } from '../assets/love-story/script';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  getScript(): Script {
    const validationResult = this.validateScript(loveStory);

    if (validationResult.isValid) {
      return loveStory;
    } else {
      return this.invalidScript(validationResult.error);
    }
  }

  private invalidScript(description: string): Script {
    return {
      events: [
        {
          title: 'invalid script',
          description,
          actions: []
        }
      ],
      firstEvent: 'invalid script'
    };
  }

  private validateScript(script: Script): ValidationResult {
    const actions = this.collectActions(script.events);
    // TODO
    // const duplicateEventTitles = this.getDuplicateItemsInListByTitle(game.events);
    // const deplicateActionTitles
    const triggeredEventsMissing = this.getItemMissingInListByTitle(this.collectTriggeredEventTitlesFromActions(actions), script.events);

    if (triggeredEventsMissing.length === 0) {
      return { isValid: true };
    } else {
      return { isValid: false, error: `missing next scene titles:\n${triggeredEventsMissing.join('\n')}\n` };
    }
  }

  private collectTriggeredEventTitlesFromActions(actions: Action[]): string[] {
    return actions.reduce((nextSceneTitles, action) => {
      if (action.triggerEvent) {
        return [...nextSceneTitles, action.triggerEvent];
      } else {
        return nextSceneTitles;
      }
    }, []);
  }

  private collectActions(events: Event[]): Action[] {
    return events.reduce((actions, event) => [...actions, ...event.actions], []);
  }


  private getItemMissingInListByTitle(titles: string[], list: TitledItem[]): string[] {
    return titles.reduce((titlesMissing, title) => {
      if (this.doesTitleExistInList(title, list)) {
        return titlesMissing;
      } else {
        return [...titlesMissing, title];
      }
    }, []);
  }

  private doesTitleExistInList(title: string, list: TitledItem[]): boolean {
    for (const item of list) {
      if (item.title === title) {
        return true;
      }
    }
    return false;
  }
}


interface TitledItem {
  title: string;
  [key: string]: any;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}
