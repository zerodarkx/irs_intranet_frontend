import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseInicioComponent } from './pages/base-inicio/base-inicio.component';

const routes: Routes = [
  {
    path: '',
    component: BaseInicioComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InicioRoutingModule { }
