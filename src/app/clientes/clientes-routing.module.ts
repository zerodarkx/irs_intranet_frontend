import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutClienteComponent } from './pages/layout-cliente/layout-cliente.component';
import { DetalleClienteComponent } from './components/detalle-cliente/detalle-cliente.component';
import { SimuladorComponent } from './components/simulador/simulador.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { FichaComiteComponent } from './components/ficha-comite/ficha-comite.component';
import { NuevoClienteComponent } from './pages/nuevo-cliente/nuevo-cliente.component';
import { BuscarClienteComponent } from './pages/buscar-cliente/buscar-cliente.component';
import { GestionComponent } from './components/gestion/gestion.component';

const routes: Routes = [
  {
    path: 'buscarCliente',
    component: BuscarClienteComponent
  },
  {
    path: 'nuevoCliente',
    component: NuevoClienteComponent
  },
  {
    path: ':idCliente',
    component: LayoutClienteComponent,
    children: [
      { path: 'detalle', component: DetalleClienteComponent },
      { path: 'documentos', component: DocumentosComponent },
      { path: 'fichaComite', component: FichaComiteComponent },
      { path: 'reserva', component: ReservaComponent },
      { path: 'simulador', component: SimuladorComponent },
      { path: 'gestion', component: GestionComponent },
      { path: '**', redirectTo: 'detalle', pathMatch: 'full' }
    ]
  },
  {
    path: '**',
    redirectTo: 'buscarCliente',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }
