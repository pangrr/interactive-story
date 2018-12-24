// angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// 3rd party
import { ClipboardModule } from 'ngx-clipboard';
// angular material
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material/snack-bar';
// my services
import { ScriptService } from './script.service';
import { MyRouteReuseStrategy } from './route-reuse.strategy';
// my components
import { AppComponent } from './app.component';
import { PlayComponent } from './play/play.component';
import { NotesComponent } from './notes/notes.component';
import { DialogComponent } from './dialog/dialog.component';
import { EditComponent } from './edit/edit.component';
import { JsonComponent } from './json/json.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayComponent,
    NotesComponent,
    DialogComponent,
    EditComponent,
    JsonComponent,
  ],
  entryComponents: [
    NotesComponent,
    DialogComponent,
    JsonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    // angular material
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule
  ],
  providers: [
    ScriptService,
    {
      provide: RouteReuseStrategy,
      useClass: MyRouteReuseStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
