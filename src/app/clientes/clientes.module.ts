import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientesRoutingModule } from './clientes-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { TableModule } from 'primeng/table';

import { DocumentosComponent } from './components/documentos/documentos.component';
import { FichaComiteComponent } from './components/ficha-comite/ficha-comite.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { LayoutClienteComponent } from './pages/layout-cliente/layout-cliente.component';
import { NuevoClienteComponent } from './pages/nuevo-cliente/nuevo-cliente.component';
import { ReservaComponent } from './components/reserva/reserva.component';
import { SimuladorComponent } from './components/simulador/simulador.component';
import { BuscarClienteComponent } from './pages/buscar-cliente/buscar-cliente.component';
import { NavbarBuscarClienteComponent } from './components/navbar/buscar-cliente/buscar-cliente.component';
import { NavbarClienteDetalleComponent } from './components/navbar/cliente-detalle/cliente-detalle.component';
import { NavbarAgregarClienteComponent } from './components/navbar/agregar-cliente/agregar-cliente.component';
import { GestionComponent } from './components/gestion/gestion.component';


@NgModule({
  declarations: [
    LayoutClienteComponent,
    InicioComponent,
    DocumentosComponent,
    FichaComiteComponent,
    ReservaComponent,
    SimuladorComponent,
    NuevoClienteComponent,
    BuscarClienteComponent,
    NavbarBuscarClienteComponent,
    NavbarClienteDetalleComponent,
    NavbarAgregarClienteComponent,
    GestionComponent,
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
