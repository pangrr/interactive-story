import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MemoriesDialogComponent } from '../memories-dialog/memories-dialog.component';
import { Memory } from '../memory';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.css']
})
export class MeComponent implements OnInit {
  memories: Memory[] = MEMORIES;

  constructor(public memoriesDialog: MatDialog) { }

  ngOnInit() {
  }

  openMemoriesDialog(): void {
    this.memoriesDialog.open(MemoriesDialogComponent, {
      width: '500px',
      data: this.memories
    });
  }

}


/* tslint:disable */
const MEMORIES: Memory[] = [
  {
    label: '阿华',
    detail: '阿华是我第一份工的同事，听说了聚餐的事情，主动来找我讲话，一来二去也就熟了。我干满三个月便换工作。他原本兴冲冲要和我一起换，结果当上小领导，提了工资，也就作罢。'
  },
  {
    label: '我的工作',
    detail: '初来时马虎，我第一份工其实是流水线上作业。每天不用动脑筋，大把的时间拿来想事情，也可以什么都不想。车间主任是个五十几岁的老头，他侄儿是厂长，见了他倒要避让三分，有一回站在厂门口受他教训。我刚来时，组里聚餐，他要我坐他旁边，喝点酒就只手在我腿上摸来摸去，说：“成都啊，我是知道的。那个四川羊肉，羊肉火锅最出名嘛。我过去手下很多人都是你们那边来的。你到了我这里，姑娘家人生地不熟，我罩着你。”讲到最后几个字，在我大腿内侧捏了一下。我把酒杯碰到地上摔碎，起来去上厕所。回来就站着，任谁劝也不再吃了。推杯换盏之际，主任脸上红彤彤反光，斜着一只鼠眼问我：“谈过恋爱没？”我说：“谈过。”他咧嘴微微一笑：“个么还装清纯。”后来我知道，所有新人都被他摸过，也有更夸张的。我暗自好笑，不仅要当他侄儿的老子，还要当厂里人的老子。以后我见他如空气，他也视我如眼中砂。有的人看不惯我，说大家都一样，怎的我就矜贵些，摸不得碰不得。人人亦当是我性子烈，但也不忘记给我穿小鞋。'
  }
];

