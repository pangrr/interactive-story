import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatToolbarModule } from '@angular/material/toolbar';
// my services
import { ScriptService } from './script.service';
// my components
import { AppComponent } from './app.component';
import { PlayStoryComponent } from './play-story/play-story.component';
import { NotesComponent } from './notes/notes.component';
import { DialogComponent } from './dialog/dialog.component';
import { EditScriptComponent } from './edit-script/edit-script.component';
import { JsonComponent } from './json/json.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayStoryComponent,
    NotesComponent,
    DialogComponent,
    EditScriptComponent,
    JsonComponent,
  ],
  entryComponents: [
    NotesComponent,
    DialogComponent,
    JsonComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    // angular material
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule
  ],
  providers: [ScriptService],
  bootstrap: [AppComponent]
})
export class AppModule { }
