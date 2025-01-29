import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ClienteSalidaDetalle, TipoSalidas, TipoSubSalidas } from 'src/app/interfaces';
import { SalidasService, TipoSalidasService } from 'src/app/services';
import { formateadorMiles } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

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
    fecha_cursado: [''],
    fecha_termino: [''],
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

  formateadorMiles(valor: number | undefined): string {
    return formateadorMiles(valor || 0);
  }

  obtenerDatosCliente() {
    this.sSalidas.obtenerClienteSalidaDetalle()
      .subscribe({
        next: (response) => {
          console.log(response);


          this.formSalida.patchValue({
            ...response.data,
            valor_comercial: formateadorMiles(response.data.valor_comercial),
            valor_contrato: formateadorMiles(response.data.valor_contrato),
            ltv: formateadorMiles(response.data.ltv),
            tipo_salida: response.data.tipo_salida,
            tipo_subSalida: response.data.tipo_subSalida
          });
        },
        error: (error: HttpErrorResponse) => {
          console.log(error);
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
}
