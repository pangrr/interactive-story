import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamePlayComponent } from './game-play/game-play.component';

const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: GamePlayComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
