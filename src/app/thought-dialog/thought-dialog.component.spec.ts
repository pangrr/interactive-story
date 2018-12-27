import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThoughtDialogComponent } from './thought-dialog.component';

describe('MindComponent', () => {
  let component: ThoughtDialogComponent;
  let fixture: ComponentFixture<ThoughtDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThoughtDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThoughtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
