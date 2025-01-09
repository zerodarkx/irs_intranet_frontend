import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './pages/base/base.component';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { DetalleComponent } from './components/detalle/detalle.component';

const routes: Routes = [
  {
    path: 'buscador',
    component: BuscadorComponent
  },
  {
    path: ':idCliente',
    component: BaseComponent,
    children: [
      { path: 'detalle', component: DetalleComponent },
      { path: '**', redirectTo: 'detalle', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: 'buscador',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalidasRoutingModule { }
