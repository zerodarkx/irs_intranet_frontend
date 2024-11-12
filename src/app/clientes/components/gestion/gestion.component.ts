import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GestionCliente, ResultadoAgregarGestionCliente, ResultadoGestionCliente } from 'src/app/interfaces/cliente';
import { ResultadoTipoGestion, TipoGestion } from 'src/app/interfaces/tipoGestion';
import { ClienteService } from 'src/app/services/cliente.service';
import { TipoGestionService } from 'src/app/services/tipo-gestion.service';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-gestion',
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
        next: ({ data }: ResultadoTipoGestion) => {
          this.tipo_gestion = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  cargarGestionesCliente() {
    this.sCliente.obtenerGestionesClientePorId()
      .subscribe({
        next: ({ data }: ResultadoGestionCliente) => {
          this.gestiones_cliente = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  agregarGestionCliente() {
    this.sCliente.agregarGestionCliente(this.formGestion.value)
      .subscribe({
        next: (response: ResultadoAgregarGestionCliente) => {
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
