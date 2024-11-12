import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseInicioComponent } from './pages/base-inicio/base-inicio.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: BaseInicioComponent,
  },
  {
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
