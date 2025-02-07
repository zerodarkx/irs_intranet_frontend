import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TipoGestion, GestionSalidas } from 'src/app/interfaces';
import { SalidasService, TipoGestionService } from 'src/app/services';

import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-gestiones',
  templateUrl: './gestiones.component.html',
  styleUrls: ['./gestiones.component.css']
})
export class GestionesComponent {
  tipo_gestion: TipoGestion[] = []

  gestiones_cliente: GestionSalidas[] = []

  formGestion: FormGroup = this.fb.group({
    tipo_gestion: [[], [
      Validators.required
    ]],
    comentario_gestion: ['', [
      Validators.required,
      Validators.minLength(6)
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private sTipoGestion: TipoGestionService,
    private sSalidas: SalidasService,
  ) {

  }
  ngOnInit(): void {
    this.cargarTipoGestion();
    this.cargarGestionesCliente();
  }

  cargarTipoGestion() {
    this.sTipoGestion.obtenerTipoGestion()
      .subscribe({
        next: ({ data }) => {
          this.tipo_gestion = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  cargarGestionesCliente() {
    this.sSalidas.obtenerGestionSalidaPorCliente()
      .subscribe({
        next: ({ data }) => {
          this.gestiones_cliente = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  agregarGestionCliente() {
    this.sSalidas.agregarGestionPorCliente(this.formGestion.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.data.icono as IconoSweetAlert,
            mensaje: response.data.mensaje,
            titulo: response.data.titulo
          })

          if (response.ok) {
            this.cargarGestionesCliente()
            this.formGestion.reset()
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }
}
