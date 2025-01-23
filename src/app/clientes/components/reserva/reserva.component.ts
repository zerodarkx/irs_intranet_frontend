import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ReservasClientes, ResultadoObtenerReservasClientes } from 'src/app/interfaces';
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
        next: (response: ResultadoObtenerReservasClientes) => {
          this.datosInversionistas = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }
}
