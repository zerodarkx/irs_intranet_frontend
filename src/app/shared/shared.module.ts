import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MensajeValidadorComponent } from './components/mensaje-validador/mensaje-validador.component';
import { FooterComponent } from './components/footer/footer.component';
import { CargandoComponent } from './components/cargando/cargando.component';
import { CurrencyPesoChilenoPipe } from '../pipe/currency-peso-chileno.pipe';


@NgModule({
  declarations: [
    FooterComponent,
    MensajeValidadorComponent,
    CargandoComponent,
    CurrencyPesoChilenoPipe,
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    FooterComponent,
    MensajeValidadorComponent,
    CargandoComponent,
    CurrencyPesoChilenoPipe,
  ],
})
export class SharedModule { }
