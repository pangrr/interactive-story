import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

// my components
import { MeComponent } from './me/me.component';
import { MemoriesDialogComponent } from './memories-dialog/memories-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MeComponent,
    MemoriesDialogComponent
  ],
  entryComponents: [
    MemoriesDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // angular material
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
