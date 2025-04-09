import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorretajeRoutingModule } from './corretaje-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';

import { BusquedaCorretajeComponent } from './pages/busqueda-corretaje/busqueda-corretaje.component';
import { InicioCorretajeComponent } from './pages/inicio-corretaje/inicio-corretaje.component';
import { DetalleCorretajeComponent } from './components/detalle-corretaje/detalle-corretaje.component';
import { MenuComponent } from './components/menu/menu.component';
import { CaracteristicasCorretajeComponent } from './components/caracteristicas-corretaje/caracteristicas-corretaje.component';
import { DocumentosCorretajeComponent } from './components/documentos-corretaje/documentos-corretaje.component';
import { BitacoraCorretajeComponent } from './components/bitacora-corretaje/bitacora-corretaje.component';
import { ImagenesCorretajeComponent } from './components/imagenes-corretaje/imagenes-corretaje.component';


@NgModule({
  declarations: [
    BusquedaCorretajeComponent,
    InicioCorretajeComponent,
    DetalleCorretajeComponent,
    CaracteristicasCorretajeComponent,
    MenuComponent,
    BitacoraCorretajeComponent,
    DocumentosCorretajeComponent,
    ImagenesCorretajeComponent,
    CaracteristicasCorretajeComponent,
    DocumentosCorretajeComponent,
    BitacoraCorretajeComponent,
    ImagenesCorretajeComponent
  ],
  imports: [
    CommonModule,
    CorretajeRoutingModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule,
    TableModule,
    FormsModule,
  ]
})
export class CorretajeModule { }
