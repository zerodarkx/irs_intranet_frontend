import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InversionistaRoutingModule } from './inversionista-routing.module';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AdminComponent } from './components/admin/admin.component';
import { SharedModule } from "../shared/shared.module";
import { TableModule } from 'primeng/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InicioComponent,
    AdminComponent
  ],
  imports: [
    CommonModule,
    InversionistaRoutingModule,
    SharedModule,
    TableModule,
    NgSelectModule,
    ReactiveFormsModule
]
})
export class InversionistaModule { }
