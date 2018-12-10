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


// my components
import { AppComponent } from './app.component';
import { GamePlayComponent } from './game-play/game-play.component';
import { MemoriesDialogComponent } from './memories-dialog/memories-dialog.component';

// my services
import { GameService } from './game.service';


@NgModule({
  declarations: [
    AppComponent,
    GamePlayComponent,
    MemoriesDialogComponent
  ],
  entryComponents: [
    MemoriesDialogComponent
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
