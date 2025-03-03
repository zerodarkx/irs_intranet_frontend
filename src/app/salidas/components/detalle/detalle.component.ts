import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TipoSalidas, TipoSubSalidas } from 'src/app/interfaces';
import { SalidasService, TipoSalidasService } from 'src/app/services';
import { formateadorMiles } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'salidas-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  tipoSalida: TipoSalidas[] = []
  tipoSubSalida: TipoSubSalidas[] = []

  formSalida: FormGroup = this.fb.group({
    id_cliente: [''],
    rut: [''],
    nombre: [''],
    correo: [''],
    fecha_cursado_inicio: [''],
    fecha_cursado_termino: [''],
    direccion: [''],
    telefono: [''],
    ejecutivo: [''],
    inversionista: [''],
    valor_comercial: [''],
    valor_contrato: [''],
    ltv: [''],
    region: [''],
    comuna: [''],
    tipo_salida: [null, Validators.required],
    tipo_subSalida: [null, Validators.required],
    fecha_cliente_termino: [null, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private sSalidas: SalidasService,
    private sTipoSalida: TipoSalidasService
  ) { }

  ngOnInit(): void {
    this.obtenerDatosCliente();
    this.obtenerTipoSalidas();
  }

  obtenerDatosCliente() {
    this.sSalidas.obtenerClienteSalidaDetalle()
      .subscribe({
        next: (response) => {
          this.formSalida.patchValue({
            ...response.data,
            valor_comercial: formateadorMiles(response.data.valor_comercial),
            valor_contrato: formateadorMiles(response.data.valor_contrato),
            ltv: formateadorMiles(response.data.ltv),
          });
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      });
  }

  obtenerTipoSalidas() {
    this.sTipoSalida.obtenerTodosTipoSalidas()
      .subscribe({
        next: (response) => {
          this.tipoSalida = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      });
    this.sTipoSalida.obtenerTodosTipoSubSalidas()
      .subscribe({
        next: (response) => {
          this.tipoSubSalida = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      });
  }

  modificarClienteSalidaDetalle() {
    const { tipo_salida, tipo_subSalida, fecha_cliente_termino } = this.formSalida.value;
    const data = { id_tipoSalida: tipo_salida, id_tipoSubSalida: tipo_subSalida, fecha_cliente_termino };

    this.sSalidas.modificarClienteSalidaDetalle(data)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: "Exito",
            mensaje: response.mensaje
          })
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }
}
