import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InicioRoutingModule } from './inicio-routing.module';
import { BaseInicioComponent } from './pages/base-inicio/base-inicio.component';
import { SharedModule } from "../shared/shared.module";


@NgModule({
  declarations: [
    BaseInicioComponent,
  ],
  imports: [
    CommonModule,
    InicioRoutingModule,
    SharedModule
]
})
export class InicioModule { }
