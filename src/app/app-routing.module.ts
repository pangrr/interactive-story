import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayStoryComponent } from './play-story/play-story.component';
import { EditScriptComponent } from './edit-script/edit-script.component';

const routes: Routes = [
  { path: '', redirectTo: '/story', pathMatch: 'full' },
  { path: 'story', component: PlayStoryComponent },
  { path: 'script', component: EditScriptComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
