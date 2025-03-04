import { Component, OnInit } from '@angular/core';

import { ErrorHttpCustom, ReservasClientes } from 'src/app/interfaces';
import { ClienteService } from 'src/app/services';

import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'cliente-reserva',
  templateUrl: './reserva.component.html',
  styles: []
})
export class ReservaComponent implements OnInit {

  datosInversionistas: ReservasClientes[] = []

  constructor(
    private sCliente: ClienteService
  ) { }

  ngOnInit(): void {
    this.sCliente.obtenerReservasCliente()
      .subscribe({
        next: (response) => {
          this.datosInversionistas = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      })
  }
}
