import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ClienteService, ExportarPdfService, SimuladorService } from 'src/app/services';
import { dejarNumeroBrutos, formateadorMiles, formateadorMilesDesdeBase, soloNumeros } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-simulacion-cierre',
  templateUrl: './simulacion-cierre.component.html',
  styleUrls: ['./simulacion-cierre.component.css']
})
export class SimulacionCierreComponent implements OnInit {

  descargar: boolean = false;

  formSimuladorCierre: FormGroup = this.fb.group({
    id_simulacionCierre: [],
    id_cliente: [],
    administracion: [0],
    administracion2: [0],
    comision: [0],
    contribuciones: [0],
    costo_anual: [0],
    descuento: [0],
    deuda_hipotecaria: [0],
    gastos_operacionales: [0],
    porc_compraventa: [85],
    provision_contribucion: [0],
    renta_mensual: [0],
    valorFavorCliente: [0],
    valor_comercial: [0],
    valor_compra_venta: [0],
    valor_contrato: [0],
    liquido_cliente: [0],
    observaciones: [],
    fecha: [],
    t_simulacion: [''],
    t_valor_comercial: ['Valor de Propiedad'],
    t_valor_compraventa: ['Valor de Compra'],
    t_afavor: ['Fondo a Favor del Cliente, que en esta caso le permitira para acreditar pie para la salida. Nosotros como FIP lo damos por pagado de inmediato en los contratos respectivos'],
    t_toma: [''],
    t_tasa: [''],
    t_deuda_bruta: ['Monto deuda Bruta'],
    t_renta: ['Montos de Rentas prepagadas por un año'],
    t_admin1: ['Comisiones de Administracion 1'],
    t_admin2: ['Comisiones de Administracion 2'],
    t_gastos: ['Gastos Operacionales'],
    t_alzamiento: ['Acreedor Hipotecario'],
    t_contribuciones: ['Pago Contribuciones Vencidas'],
    t_provision: ['Provisión de fondo Anual'],
    t_liquido: ['Liquido Cliente'],
  });

  constructor(
    private fb: FormBuilder,
    private sSimulador: SimuladorService,
    private sExportarPdf: ExportarPdfService
  ) { }

  ngOnInit(): void {
    this.obtenerDataSimulacion();
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formSimuladorCierre.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  soloNumeros(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = soloNumeros(input.value)
    this.formSimuladorCierre.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  obtenerDataSimulacion() {

    this.sSimulador.obtenerSimulacionCierre()
      .subscribe({
        next: (response) => {
          this.descargar = response.descargar;

          this.formSimuladorCierre.patchValue({
            ...response.data,
            valor_comercial: formateadorMilesDesdeBase(response.data.valor_comercial),
            valor_compra_venta: formateadorMilesDesdeBase(response.data.valor_compra_venta),
            administracion: formateadorMilesDesdeBase(response.data.administracion),
            administracion2: formateadorMilesDesdeBase(response.data.administracion2),
            costo_anual: formateadorMilesDesdeBase(response.data.costo_anual),
            valorFavorCliente: formateadorMilesDesdeBase(response.data.valorFavorCliente),
            descuento: formateadorMilesDesdeBase(response.data.descuento),
            comision: formateadorMilesDesdeBase(response.data.comision),
            valor_contrato: formateadorMilesDesdeBase(response.data.valor_contrato),
            deuda_hipotecaria: formateadorMilesDesdeBase(response.data.deuda_hipotecaria),
            gastos_operacionales: formateadorMilesDesdeBase(response.data.gastos_operacionales),
            renta_mensual: formateadorMilesDesdeBase(response.data.renta_mensual)
          });

          this.calcularSimulacion();

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  calcularSimulacion() {
    let valor_comercial = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('valor_comercial')?.value));
    let plazo_prepagado = 12;
    let descuento = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('descuento')?.value));
    let porc_compraventa = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('porc_compraventa')?.value));
    let comision = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('comision')?.value));
    let deuda_hipotecaria = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('deuda_hipotecaria')?.value));
    let contribuciones = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('contribuciones')?.value));
    let provsion_contribuciones = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('provision_contribucion')?.value));
    let gastos_operacionales = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('gastos_operacionales')?.value));
    let renta_mensual = Number(dejarNumeroBrutos(this.formSimuladorCierre.get('renta_mensual')?.value));

    let compraventa_res: number;
    let saldo: number;

    // //inicio de formulas

    // //calcula el valor_compraventa
    compraventa_res = valor_comercial * porc_compraventa / 100;

    // //formula para sacar liquido
    let valor_contrato = valor_comercial * (descuento / 100);
    let costo_anual = valor_contrato * plazo_prepagado * (renta_mensual / 100);
    let administracion = (valor_contrato * ((comision - 2) / 100) * 1.19);
    let administracion2 = (valor_contrato * 0.02) * 1.19;
    let montoPreAprobado = valor_contrato - costo_anual - administracion - administracion2 - gastos_operacionales - deuda_hipotecaria - contribuciones - provsion_contribuciones;

    saldo = compraventa_res - valor_contrato;

    this.formSimuladorCierre.patchValue({
      valor_contrato: formateadorMilesDesdeBase(valor_contrato),
      administracion: formateadorMilesDesdeBase(administracion),
      administracion2: formateadorMilesDesdeBase(administracion2),
      costo_anual: formateadorMilesDesdeBase(costo_anual),
      valorFavorCliente: formateadorMilesDesdeBase(saldo),
      valor_compra_venta: formateadorMilesDesdeBase(compraventa_res),
      liquido_cliente: formateadorMilesDesdeBase(montoPreAprobado)
    });

  }

  guardarSimulacion() {
    this.sSimulador.crearEditarSimulacionCierre(this.formSimuladorCierre.value)
      .subscribe({
        next: (respose) => {
          if (respose.ok) {
            this.formSimuladorCierre.patchValue({ id_simulacionCierre: respose.data.id_simulacionCierre });
            this.descargar = true;
          } else {
            this.descargar = false;
          }
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            mensaje: respose.data.mensaje,
            titulo: respose.data.titulo
          });
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  exportarCierreFicha() {
    this.sExportarPdf.exportarfichaCierreSimulacionPdf({
      id_cliente: this.formSimuladorCierre.get('id_cliente')?.value
    }).subscribe({
      next: (response) => {
        const blob = new Blob([new Uint8Array(response.archivo.data).buffer])
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = response.nombre_archivo;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (error: HttpErrorResponse) => {
        errorConexionServidor(error);
      }
    });
  }

}
