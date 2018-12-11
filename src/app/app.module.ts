import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
// my services
import { GameService } from './game.service';
// my components
import { AppComponent } from './app.component';
import { GamePlayComponent } from './game-play/game-play.component';
import { NotesComponent } from './notes/notes.component';
import { MindComponent } from './mind/mind.component';


@NgModule({
  declarations: [
    AppComponent,
    GamePlayComponent,
    NotesComponent,
    MindComponent,
  ],
  entryComponents: [
    NotesComponent,
    MindComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // angular material
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
