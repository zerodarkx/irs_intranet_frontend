import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormulariosRoutingModule } from './formularios-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';

import { FormularioComponent } from './pages/formulario/formulario.component';
import { PeruComponent } from './components/peru/peru.component';
import { ContactanosComponent } from './components/chile/contactanos/contactanos.component';
import { IngresoComponent } from './components/chile/ingreso/ingreso.component';

@NgModule({
  declarations: [
    FormularioComponent,
    PeruComponent,
    ContactanosComponent,
    IngresoComponent
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
