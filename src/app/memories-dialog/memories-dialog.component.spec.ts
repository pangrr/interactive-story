import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoriesDialogComponent } from './memories-dialog.component';

describe('MemoriesDialogComponent', () => {
  let component: MemoriesDialogComponent;
  let fixture: ComponentFixture<MemoriesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoriesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoriesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
