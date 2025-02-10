import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChartModule } from 'primeng/chart';

import { MensajeValidadorComponent } from './components/mensaje-validador/mensaje-validador.component';
import { FooterComponent } from './components/footer/footer.component';
import { CargandoComponent } from './components/cargando/cargando.component';
import { CurrencyPesoChilenoPipe } from '../pipe/currency-peso-chileno.pipe';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ModalComponent } from './components/modal/modal.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';


@NgModule({
  declarations: [
    FooterComponent,
    MensajeValidadorComponent,
    CargandoComponent,
    CurrencyPesoChilenoPipe,
    NavbarComponent,
    ModalComponent,
    ErrorPageComponent
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
    NavbarComponent,
    ChartModule,
    ModalComponent
  ],
})
export class SharedModule { }
