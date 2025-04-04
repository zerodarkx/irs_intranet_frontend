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
import { GastosClienteComponent } from './components/gastos-cliente/gastos-cliente.component';
import { CurseComponent } from './components/curse/curse.component';
import { RechazarMasivoComponent } from './pages/rechazar-masivo/rechazar-masivo.component';
import { SimulacionCierreComponent } from './components/simulacion-cierre/simulacion-cierre.component';

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
    path: 'rechazarMasivo',
    component: RechazarMasivoComponent
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
      { path: 'simuladorCierre', component: SimulacionCierreComponent },
      { path: 'gestion', component: GestionComponent },
      { path: 'gastoCliente', component: GastosClienteComponent },
      { path: 'curse', component: CurseComponent },
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
