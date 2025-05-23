import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormulariosRoutingModule } from './formularios-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../shared/shared.module';

import { FormularioComponent } from './pages/formulario/formulario.component';
import { PeruComponent } from './components/peru/peru.component';
import { IngresoChileComponent } from './components/chile/ingreso-chile/ingreso-chile.component';
import { ContactanosChileComponent } from './components/chile/contactanos-chile/contactanos-chile.component';

@NgModule({
  declarations: [
    FormularioComponent,
    PeruComponent,
    IngresoChileComponent,
    ContactanosChileComponent
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
