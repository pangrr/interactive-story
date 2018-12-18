import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { Script } from '../script';

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


function validateScript(control: AbstractControl) {
  let script: Script;
  try {
    script = JSON.parse(control.value);
  } catch (e) {
    return { invalidJson: true };
  }

  return null;
}


@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.css']
})
export class JsonComponent {
  script: FormControl;
  matcher = new MyErrorStateMatcher();

  constructor(
    public dialogRef: MatDialogRef<JsonComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    this.script = new FormControl(JSON.stringify(data, null, 2), [
      Validators.required,
      validateScript
    ]);
  }

  submit(): void {
    this.dialogRef.close(JSON.parse(this.script.value));
  }
}
