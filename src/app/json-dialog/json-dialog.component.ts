import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { validateScript } from '../script';


class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

function Validator(control: AbstractControl): { [key: string]: any } | null {
  const invalid = validateScript(control.value);

  for (const key of Object.keys(invalid)) {
    if (invalid[key] === true || invalid[key].length > 0) {
      return invalid;
    }
  }

  return null;
}


@Component({
  selector: 'app-json-dialog',
  templateUrl: './json-dialog.component.html',
  styleUrls: ['./json-dialog.component.css']
})
export class JsonDialogComponent {
  script: FormControl;
  matcher = new MyErrorStateMatcher();
  objectKeys = Object.keys;

  constructor(
    public dialogRef: MatDialogRef<JsonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.script = new FormControl(JSON.stringify(data, null, 2), [Validator]);
  }

  submit(): void {
    this.dialogRef.close(JSON.parse(this.script.value));
  }
}
