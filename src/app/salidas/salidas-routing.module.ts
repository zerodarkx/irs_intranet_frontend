import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseComponent } from './pages/base/base.component';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { ProrrogaComponent } from './components/prorroga/prorroga.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { CurseComponent } from './components/curse/curse.component';
import { SimulacionComponent } from './components/simulacion/simulacion.component';
import { GestionesComponent } from './components/gestiones/gestiones.component';

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
      { path: 'gestiones', component: GestionesComponent },
      { path: 'bitacora', component: BitacoraComponent },
      { path: 'prorroga', component: ProrrogaComponent },
      { path: 'simulacion', component: SimulacionComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'curse', component: CurseComponent },
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
