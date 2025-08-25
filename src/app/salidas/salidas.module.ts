import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalidasRoutingModule } from './salidas-routing.module';
import { BaseComponent } from './pages/base/base.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { DetalleComponent } from './components/detalle/detalle.component';
import { MenuComponent } from './components/menu/menu.component';
import { BitacoraComponent } from './components/bitacora/bitacora.component';
import { DocumentosComponent } from './components/documentos/documentos.component';
import { CurseComponent } from './components/curse/curse.component';
import { SimulacionComponent } from './components/simulacion/simulacion.component';
import { GestionesComponent } from './components/gestiones/gestiones.component';
import { ProrrogasComponent } from './components/prorrogas/prorrogas.component';


@NgModule({
  declarations: [
    BaseComponent,
    BuscadorComponent,
    DetalleComponent,
    MenuComponent,
    BitacoraComponent,
    DocumentosComponent,
    CurseComponent,
    SimulacionComponent,
    GestionesComponent,
    ProrrogasComponent
  ],
  imports: [
    CommonModule,
    SalidasRoutingModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule
  ]
})
export class SalidasModule { }
