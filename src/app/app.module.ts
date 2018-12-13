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
import { MatTreeModule } from '@angular/material/tree';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
// my services
import { GameService } from './game.service';
// my components
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { NotesComponent } from './notes/notes.component';
import { MindComponent } from './mind/mind.component';
import { ScriptComponent } from './script/script.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    NotesComponent,
    MindComponent,
    ScriptComponent,
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
    MatTooltipModule,
    MatTreeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [GameService],
  bootstrap: [AppComponent]
})
export class AppModule { }
