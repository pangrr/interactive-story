import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MeComponent } from './me/me.component';

const routes: Routes = [
  { path: 'me', component: MeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
