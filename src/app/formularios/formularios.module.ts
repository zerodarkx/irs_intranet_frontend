import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormulariosRoutingModule } from './formularios-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';

import { ChileComponent } from './components/chile/chile.component';
import { FormularioComponent } from './pages/formulario/formulario.component';
import { PeruComponent } from './components/peru/peru.component';

@NgModule({
  declarations: [
    ChileComponent,
    FormularioComponent,
    PeruComponent
  ],
  imports: [
    CommonModule,
    FormulariosRoutingModule,
    NgSelectModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class FormulariosModule { }
