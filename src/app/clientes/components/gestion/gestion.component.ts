import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorHttpCustom, GestionCliente, TipoGestion } from 'src/app/interfaces';
import { ClienteService, TipoGestionService } from 'src/app/services';

import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'cliente-gestion',
  templateUrl: './gestion.component.html',
  styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {

  tipo_gestion: TipoGestion[] = []

  gestiones_cliente: GestionCliente[] = []

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
    private sCliente: ClienteService,
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
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

  cargarGestionesCliente() {
    this.sCliente.obtenerGestionesClientePorId()
      .subscribe({
        next: ({ data }) => {
          this.gestiones_cliente = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

  agregarGestionCliente() {
    this.sCliente.agregarGestionCliente(this.formGestion.value)
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
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

}
