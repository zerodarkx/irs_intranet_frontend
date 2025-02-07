import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TableModule } from 'primeng/table';

import { DocumentosComponent } from './components/documentos/documentos.component';
import { FichaComiteComponent } from './components/ficha-comite/ficha-comite.component';
import { DetalleClienteComponent } from './components/detalle-cliente/detalle-cliente.component';
import { LayoutClienteComponent } from './pages/layout-cliente/layout-cliente.component';
import { NuevoClienteComponent } from './pages/nuevo-cliente/nuevo-cliente.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { SimuladorComponent } from './components/simulador/simulador.component';
import { BuscarClienteComponent } from './pages/buscar-cliente/buscar-cliente.component';
import { GestionComponent } from './components/gestion/gestion.component';
import { CurseComponent } from './components/curse/curse.component';
import { GastosClienteComponent } from './components/gastos-cliente/gastos-cliente.component';
import { MenuComponent } from './components/menu/menu.component';
import { RechazarMasivoComponent } from './pages/rechazar-masivo/rechazar-masivo.component';
import { SimulacionCierreComponent } from './components/simulacion-cierre/simulacion-cierre.component';


@NgModule({
  declarations: [
    LayoutClienteComponent,
    DetalleClienteComponent,
    DocumentosComponent,
    FichaComiteComponent,
    ReservaComponent,
    SimuladorComponent,
    NuevoClienteComponent,
    BuscarClienteComponent,
    GestionComponent,
    CurseComponent,
    GastosClienteComponent,
    MenuComponent,
    RechazarMasivoComponent,
    SimulacionCierreComponent,
  ],
  imports: [
    ClientesRoutingModule,
    CommonModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule,
    TableModule,
    FormsModule,
  ]
})
export class ClientesModule { }
