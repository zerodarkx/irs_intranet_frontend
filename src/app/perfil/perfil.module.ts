import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PerfilRoutingModule } from './perfil-routing.module';
import { BaseComponent } from './pages/base/base.component';
import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BaseComponent
  ],
  imports: [
    CommonModule,
    PerfilRoutingModule,
    SharedModule,
    NgSelectModule,
    ReactiveFormsModule
  ]
})
export class PerfilModule { }
