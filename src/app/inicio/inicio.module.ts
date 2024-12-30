import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { BaseInicioComponent } from './pages/base-inicio/base-inicio.component';
import { SharedModule } from "../shared/shared.module";
import { BaseEjecutivoComponent } from './components/base-ejecutivo/base-ejecutivo.component';
import { BaseInversionistaComponent } from './components/base-inversionista/base-inversionista.component';
import { BaseAdminComponent } from './components/base-admin/base-admin.component';


@NgModule({
  declarations: [
    BaseInicioComponent,
    BaseEjecutivoComponent,
    BaseInversionistaComponent,
    BaseAdminComponent,
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedModule
]
})
export class InicioModule { }
