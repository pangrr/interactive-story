import { Injectable } from '@angular/core';
import { Scene } from './scene';
import { Memory } from './memory';
import { Game } from './game';
import { Action } from './action';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor() { }

  getGame(): Game {
    const game = {
      scenes: SCENES,
      memories: MEMORIES,
      currentSceneTitle: '阿华来了',
      currentMemoryTitles: []
    };

    const validationResult = this.validateGame(game);

    if (validationResult.isValid) {
      return game;
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
      if (action.recallMemoryTitle) {
        return [...recallMemoryTitles, action.recallMemoryTitle];
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

/* tslint:disable */
const MEMORIES: Memory[] = [
  {
    title: '阿华',
    description: '阿华是我第一份工的同事，听说了聚餐的事情，主动来找我讲话，一来二去也就熟了。我干满三个月便换工作。他原本兴冲冲要和我一起换，结果当上小领导，提了工资，也就作罢。'
  },
  {
    title: '我的工作',
    description: '初来时马虎，我第一份工其实是流水线上作业。每天不用动脑筋，大把的时间拿来想事情，也可以什么都不想。车间主任是个五十几岁的老头，他侄儿是厂长，见了他倒要避让三分，有一回站在厂门口受他教训。我刚来时，组里聚餐，他要我坐他旁边，喝点酒就只手在我腿上摸来摸去，说：“成都啊，我是知道的。那个四川羊肉，羊肉火锅最出名嘛。我过去手下很多人都是你们那边来的。你到了我这里，姑娘家人生地不熟，我罩着你。”讲到最后几个字，在我大腿内侧捏了一下。我把酒杯碰到地上摔碎，起来去上厕所。回来就站着，任谁劝也不再吃了。推杯换盏之际，主任脸上红彤彤反光，斜着一只鼠眼问我：“谈过恋爱没？”我说：“谈过。”他咧嘴微微一笑：“个么还装清纯。”后来我知道，所有新人都被他摸过，也有更夸张的。我暗自好笑，不仅要当他侄儿的老子，还要当厂里人的老子。以后我见他如空气，他也视我如眼中砂。有的人看不惯我，说大家都一样，怎的我就矜贵些，摸不得碰不得。人人亦当是我性子烈，但也不忘记给我穿小鞋。'
  },
];

const SCENES: Scene[] = [
  {
    title: '阿华来了',
    description: '八点，阿华给我发消息，说已在门口等。',
    actions: [
      {
        title: '阿华是谁？',
        recallMemoryTitle: '阿华'
      },
      {
        title: '换了身衣服就出门',
        nextSceneTitle: '门外'
      }
    ]
  },
  {
    title: '门外',
    description: '梅雨刚过，不再笼着热。他穿着白得发亮的短袖T恤衫、破洞牛仔裤，倚在厂门口的树底下看手机。',
    actions: [
      {
        title: '走近阿华',
        nextSceneTitle: ''
      }
    ]
  },
];
