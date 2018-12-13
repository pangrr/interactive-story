import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './game/game.component';
import { ScriptComponent } from './script/script.component';

const routes: Routes = [
  { path: '', redirectTo: '/story', pathMatch: 'full' },
  { path: 'story', component: GameComponent },
  { path: 'script', component: ScriptComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
