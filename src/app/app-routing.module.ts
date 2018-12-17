import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayStoryComponent } from './play-story/play-story.component';
import { EditScriptComponent } from './edit-script/edit-script.component';

const routes: Routes = [
  { path: '', redirectTo: '/edit', pathMatch: 'full' },
  { path: 'play', component: PlayStoryComponent },
  { path: 'edit', component: EditScriptComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
