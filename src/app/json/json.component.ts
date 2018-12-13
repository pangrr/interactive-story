import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.css']
})
export class JsonComponent {
  json: string;

  constructor(
    public dialogRef: MatDialogRef<JsonComponent>,
    @Inject(MAT_DIALOG_DATA) object: { [key: string]: any }
  ) {
    this.json = JSON.stringify(object, null, 2);
  }

  submit(): void {
    this.dialogRef.close(JSON.parse(this.json));
  }

}
