import { Injectable } from '@angular/core';
import { Game, Scene, Action, loveStory } from './game';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  getGame(): Game {
    const validationResult = this.validateGame(loveStory);

    if (validationResult.isValid) {
      return loveStory;
    } else {
      return {
        scenes: [
          {
            title: 'invalid game',
            description: validationResult.error,
            actions: []
          }
        ],
        memories: [],
        currentMemoryTitles: [],
        currentSceneTitle: 'invalid game'
      };
    }
  }

  private validateGame(game: Game): ValidationResult {
    const actions = this.collectActions(game.scenes);
    // TODO
    // const duplicateCurrentMemoryTitles = this.getDuplicateStringsInList(game.currentMemoryTitles);
    // const duplicateMemoryTitles = this.getDuplicateItemInListByTitle(game.memories);
    // const duplicateSceneTitles = this.getDuplicateItemInListByTitle(game.scenes);
    // const deplicateActionTitles
    const recallMemoryTitlesMissing = this.getTitlesMissingInList(this.collectRecallMemoryTitlesFromActions(actions), game.memories);
    const nextSceneTitlesMissing = this.getTitlesMissingInList(this.collectNextSceneTitlesFromActions(actions), game.scenes);
    const currentMemoryTitlesMissing = this.getTitlesMissingInList(game.currentMemoryTitles, game.memories);

    if (recallMemoryTitlesMissing.length === 0 && nextSceneTitlesMissing.length === 0 && currentMemoryTitlesMissing.length === 0) {
      return { isValid: true };
    } else {
      let error = '';
      if (recallMemoryTitlesMissing.length > 0) {
        error += `missing recall memory titles:\n${recallMemoryTitlesMissing.join('\n')}\n`;
      }
      if (nextSceneTitlesMissing.length > 0) {
        error += `missing next scene titles:\n${nextSceneTitlesMissing.join('\n')}\n`;
      }
      if (currentMemoryTitlesMissing.length > 0) {
        error += `missing current memory titles:\n${currentMemoryTitlesMissing.join('\n')}`;
      }
      return { isValid: false, error };
    }
  }

  private collectRecallMemoryTitlesFromActions(actions: Action[]): string[] {
    return actions.reduce((recallMemoryTitles, action) => {
      if (action.recallMemoryTitles) {
        return [...recallMemoryTitles, ...action.recallMemoryTitles];
      } else {
        return recallMemoryTitles;
      }
    }, []);
  }

  private collectNextSceneTitlesFromActions(actions: Action[]): string[] {
    return actions.reduce((nextSceneTitles, action) => {
      if (action.nextSceneTitle) {
        return [...nextSceneTitles, action.nextSceneTitle];
      } else {
        return nextSceneTitles;
      }
    }, []);
  }

  private collectActions(scenes: Scene[]): Action[] {
    return scenes.reduce((actions, scene) => [...actions, ...scene.actions], []);
  }


  private getTitlesMissingInList(titles: string[], list: TitledItem[]): string[] {
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
