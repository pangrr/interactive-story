import { Script } from '../../app/game';

/* tslint:disable */
export const loveStory: Script = {
  firstEvent: '阿华说要晚些来接我',
  events: [
    {
      title: '阿华说要晚些来接我',
      description: '阿华说要晚些来接我。',
      actions: [
        {
          title: '阿华是谁？',
          recallMemories: [
            {
              title: '阿华是谁',
              description: `阿华是我第一份工的同事，听说了聚餐的事情，主动来找我讲话，一来二去也就熟了。`
            }
          ]
        },
        {
          title: '我是谁？',
          recallMemories: [
            {
              title: '我结过婚',
              description: `我是有丈夫的，结婚六年。阿华不知道我结过婚。`
            }
          ]
        },
        {
          title: '不介意',
          triggerEvent: '阿华来了'
        }
      ]
    },
    {
      title: '阿华来了',
      description: '八点，阿华给我发消息，说已在门口等。',
      actions: [
        {
          title: '换了身衣服就出门',
          triggerEvent: '出门'
        }
      ]
    },
    {
      title: '出门',
      description: `梅雨刚过，不再笼着热。
      他穿着白得发亮的短袖T恤衫、破洞牛仔裤，倚在厂门口的树底下看手机。
      `,
      actions: [
        {
          title: '朝他那边走过去',
          triggerEvent: '袜子1'
        }
      ]
    },
    {
      title: '袜子1',
      description: `我还没走近，他抬头看见我，递来一个黑色塑料袋：“新花式。”
      `,
      actions: [
        {
          title: '袜子？',
          recallMemories: [
            {
              title: '阿华的袜子',
              description: `阿华的厂是袜厂，他常拣些袜子送我。`
            }
          ]
        },
        {
          title: '“我那里好多新的都没穿，以后不要再给我拿啦。”',
          triggerEvent: '袜子2'
        },
        {
          title: '收下袜子',
          triggerEvent: '上车'
        }
      ]
    },
    {
      title: '袜子2',
      description: `他眼睛一闪，有些不好意思：“我也没什么好给你的。”`,
      actions: [
        {
          title: '收下袜子',
          triggerEvent: '上车'
        }
      ]
    },
    {
      title: '上车',
      description: `他把头盔给我戴上，说：“今天去吃好一点的馆子。”`,
      actions: [
        {
          title: '坐上了他的车后座',
          triggerEvent: '下馆子'
        }
      ]
    },
    {
      title: '下馆子',
      description: `厂门口的一条街上有七八家用玻璃箱推车卖炒饭炒面的小贩，许多人围着买吃食，吃完了要回去上夜班。阿华握着车把手，用脚划拉着地面，我们好一会才歪歪扭扭地从人堆里钻出来。
      出了人群，阿华稍稍加速。夜幕低垂，沿途的路灯哀哀地照亮我们。
      `,
      actions: [
        {
          title: '回忆起阿华的故事',
          recallMemories: [
            {
              title: '阿华和他家人',
              description: `阿华比我小两岁，来自浙江小城，家里有哥哥姐姐。他有时给我讲童年趣事，如何被姐姐扮成《白蛇传》里的青儿，一家人一团和气。我是独生女，感受不到这些，只是联想到父母老了，膝下再无别人，我舍了他们出来，将来怎么样，我是管不了的。`
            }
          ]
        }
      ]
    }
  ],

}
