import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JsonComponent } from '../json/json.component';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material';
import { ScriptService } from '../script.service';
import { Router } from '@angular/router';
import { ClipboardService } from 'ngx-clipboard';
import { Script, Script4Edit, buildScript4Edit, validateScript4Edit, buildScript, Event4Edit,
  sortEvents, Note4Edit, Action4Edit, collectPossibleNextEvents } from '../script';


@Component({
  selector: 'app-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {
  script: Script4Edit;

  constructor(
    public json: MatDialog,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    public snackBar: MatSnackBar,
    private service: ScriptService,
    private router: Router,
    private clipboardService: ClipboardService
  ) {
    iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('assets/delete.svg'));
  }

  ngOnInit() { }

  ngAfterViewInit() {
    if (!this.script) {
      // use setTimeout to handle ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.script = {
          firstEvent: '0',
          events: [{ id: '0', description: '', actions: [], notes: [], nextEvent: '', open: true }]
        };
        this.openScriptJsonEditor();
      });
    }
  }

  playScript(): void {
    this.service.setScript(buildScript(this.script));
    this.router.navigate(['/play']);
  }

  openScriptJsonEditor(): void {
    const jsonRef = this.json.open(JsonComponent, {
      width: '1000px',
      data: buildScript(this.script)
    });

    jsonRef.afterClosed().subscribe((script: Script) => {
      if (script) {
        const script4Edit = buildScript4Edit(script);
        this.script = {
          firstEvent: script4Edit.firstEvent,
          events: []
        };
        const step = 10;
        for (let i = 0; i < script4Edit.events.length; i = i + step) {
          setTimeout(() => {
            const events = [];
            for (let j = i; j < i + step && j < script4Edit.events.length; j++) {
              events.push(script4Edit.events[j]);
            }
            this.script.events.push(...events);
          });
        }
      }
    });
  }

  addEvent(): void {
    this.script.events.push(this.buildNewEvent4Edit());
  }

  appendEvent(toEventIndex: number): void {
    const newEvents: Event4Edit[] = collectPossibleNextEvents(this.script.events[toEventIndex]).map(id => this.buildNewEvent4Edit(id));

    this.script.events.splice(toEventIndex + 1, 0, ...newEvents);

    this.validateScript();
  }

  deleteEvent(eventIndex: number): void {
    this.script.events.splice(eventIndex, 1);

    this.validateScript();
  }

  sortEvents(): void {
    this.script.events = sortEvents(this.script.events, this.script.firstEvent);
  }

  addAction(actions: Action4Edit[]): void {
    actions.push({
      description: '',
      triggerEvent: '',
      think: ''
    });

    this.validateScript();
  }

  addNote(notes: Note4Edit[]): void {
    notes.push({
      title: '',
      content: ''
    });

    this.validateScript();
  }

  deleteAction(event: Event4Edit, actionIndex: number): void {
    event.actions.splice(actionIndex, 1);

    this.validateScript();
  }

  deleteNote(event: Event4Edit, noteIndex: number): void {
    event.notes.splice(noteIndex, 1);

    this.validateScript();
  }

  closeEvents(): void {
    this.script.events.forEach(event => event.open = false);
  }

  validateScript(openSnackBar: boolean = false): void {
    const valid = validateScript4Edit(this.script);

    if (openSnackBar) {
      if (valid) {
        this.openSnackBarForValidScript();
      } else {
        this.openSnackBarForInvalidScript();
      }
    }
  }

  copyScriptToClipboard(): void {
    this.clipboardService.copyFromContent(JSON.stringify(buildScript(this.script), null, 2));
  }

  private buildNewEvent4Edit(id: string = ''): Event4Edit {
    return {
      id,
      description: '',
      actions: [{
        description: '',
        triggerEvent: '',
        think: ''
      }],
      nextEvent: '',
      notes: [],
      open: true
    };
  }

  private openSnackBarForInvalidScript(): void {
    this.snackBar.open('Invalid Script', '', {
      duration: 1000,
      panelClass: 'red'
    });
  }

  private openSnackBarForValidScript(): void {
    this.snackBar.open('Valid Script', '', {
      duration: 1000,
      panelClass: 'green'
    });
  }
}
