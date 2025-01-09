import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalidasRoutingModule } from './salidas-routing.module';
import { BaseComponent } from './pages/base/base.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { BuscadorComponent } from './pages/buscador/buscador.component';
import { DetalleComponent } from './components/detalle/detalle.component';


@NgModule({
  declarations: [
    BaseComponent,
    BuscadorComponent,
    DetalleComponent
  ],
  imports: [
    CommonModule,
    SalidasRoutingModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    TableModule
  ]
})
export class SalidasModule { }
