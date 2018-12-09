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
      currentSceneTitle: '阿华说要晚些来接我',
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

/* tslint:disable */
const MEMORIES: Memory[] = [
  {
    title: '阿华',
    description: `阿华是我第一份工的同事，听说了聚餐的事情，主动来找我讲话，一来二去也就熟了。他原本兴冲冲要和我一起换工作，结果当上小领导，提了工资，也就作罢。阿华说，这是近，以后如果我再走远了，他还是要跟我一起走的。
    阿华不知道我结过婚。
    `
  },
  {
    title: '我的婚姻',
    description: `我是有丈夫的，结婚六年，他在牢里四年。我们结婚那天在火锅馆请客。他喝得多了些，出来遇到仇人，端起路边一桌人的一锅滚汤浇到人身上，把对方脸和身都烫烂了。他当晚就跑了，外面躲了一年多。中间偷偷回来过一次，给我些现金，要我跟他走。我不肯，他走时拿走我随身戴的手串。还有一回是七夕，有个小孩来敲门，交给我一个小红布袋子，说有人给了五块钱让他送。我下楼去，没找见他。那布包里有一块圆圆的温润白玉，中间一个小孔穿着红线，我现在还挂在颈子上。之后就有公安打电话来，说是抓住了，故意伤人加上偷盗，很快判了刑。我先前还要去看他，但他对我疑神疑鬼，有一回还让我滚，渐渐也就去得少了。后来听说我爸妈去过几次，劝他跟我离婚。他以为是我的意思，放话九年刑满出了监牢就来找我，到时候两个人死在一处。
    我爸妈给唬得成天做我的思想工作。亲戚朋友也知道我的事，关心起来，多少有点可怜我的意思。我在家也待不下去了。花店关门歇业，出来工作。
    `
  },
  {
    title: '我的工作',
    description: `长三角工厂多，在厂里坐办公室，清净，收入也还行。入厂时填表，我写“未婚”，有点像隐姓埋名。
    初来时马虎，我第一份工其实是流水线上作业。每天不用动脑筋，大把的时间拿来想事情，也可以什么都不想。车间主任是个五十几岁的老头，他侄儿是厂长，见了他倒要避让三分，有一回站在厂门口受他教训。我刚来时，组里聚餐，他要我坐他旁边，喝点酒就只手在我腿上摸来摸去，说：“成都啊，我是知道的。那个四川羊肉，羊肉火锅最出名嘛。我过去手下很多人都是你们那边来的。你到了我这里，姑娘家人生地不熟，我罩着你。”讲到最后几个字，在我大腿内侧捏了一下。我把酒杯碰到地上摔碎，起来去上厕所。回来就站着，任谁劝也不再吃了。推杯换盏之际，主任脸上红彤彤反光，斜着一只鼠眼问我：“谈过恋爱没？”我说：“谈过。”他咧嘴微微一笑：“个么还装清纯。”后来我知道，所有新人都被他摸过，也有更夸张的。我暗自好笑，不仅要当他侄儿的老子，还要当厂里人的老子。以后我见他如空气，他也视我如眼中砂。有的人看不惯我，说大家都一样，怎的我就矜贵些，摸不得碰不得。人人亦当是我性子烈，但也不忘记给我穿小鞋。
    我干满三个月便换工作。我换到另一个厂，因为会点英文，开始做行政。后来又换了一次。换来换去，也没离了这块工业园。
    `
  },
];

const SCENES: Scene[] = [
  {
    title: '阿华说要晚些来接我',
    description: '阿华说要晚些来接我。',
    actions: [
      {
        title: '关于阿华',
        recallMemoryTitles: ['阿华']
      },
      {
        title: '关于我',
        recallMemoryTitles: ['我的婚姻', '我的工作']
      },
      {
        title: '没事儿',
        nextSceneTitle: '阿华来了'
      }
    ]
  },
  {
    title: '阿华来了',
    description: '八点，阿华给我发消息，说已在门口等。',
    actions: [
      {
        title: '换了身衣服就出门',
        nextSceneTitle: '门外'
      }
    ]
  },
  {
    title: '门外',
    description: `梅雨刚过，不再笼着热。
    他穿着白得发亮的短袖T恤衫、破洞牛仔裤，倚在厂门口的树底下看手机。
    `,
    actions: [
      {
        title: '走近阿华',
        nextSceneTitle: ''
      }
    ]
  },
];
