import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-json',
  templateUrl: './json.component.html',
  styleUrls: ['./json.component.css']
})
export class JsonComponent {
  json: string;
  showSubmit: boolean;

  constructor(
    public dialogRef: MatDialogRef<JsonComponent>,
    @Inject(MAT_DIALOG_DATA) data: { object: { [key: string]: any }, showSubmit: boolean }
  ) {
    this.json = JSON.stringify(data.object, null, 2);
    this.showSubmit = data.showSubmit;
  }

  submit(): void {
    this.dialogRef.close(JSON.parse(this.json));
  }
}
