import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { ISimulador, ResultadoCrearSimulacion, ResultadoObtenerTodasSimulacionPorCliente } from '../../../interfaces/simulador';
import { ITipoCanales, ResultadoComisionTasaByID, ResultadoCanalesSimulacion } from '../../../interfaces/tipoSimulacionCanales';
import { IBancos, ResultadoTodosBancos } from 'src/app/interfaces/bancos';

import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { dejarNumeroBrutos, formateadorMiles, formateadorMilesDesdeBase, soloNumeros } from 'src/app/shared/utils/formateadores';
import { TipoSimulacionCanalService } from 'src/app/services/tipo-simulacion-canal.service';
import { BancoService } from 'src/app/services/banco.service';
import { SimuladorService } from 'src/app/services/simulador.service';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { ClienteService } from 'src/app/services/cliente.service';
import { ResultadoObtenerClienteById } from 'src/app/interfaces/cliente';
import { ExportarPdfService } from 'src/app/services/exportar-pdf.service';
import { exportarPdf } from 'src/app/interfaces/exportar';
import { PermisosService } from 'src/app/services/permisos.service';



@Component({
  selector: 'cliente-simulador',
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.css']
})
export class SimuladorComponent implements OnInit {

  simulacionDetalle?: ISimulador;
  simulacionesCliente: ISimulador[] = []

  formSimulacion: FormGroup = this.fb.group({
    moneda: ['UF', [Validators.required]],
    canal: [[], [Validators.required]],
    valorComercial: [0, [Validators.required]],
    descuento: ['', [Validators.required,]],
    plazoTotal: ['', [Validators.required,]],
    plazoPrepago: ['', [Validators.required,]],
    comision: ['', [Validators.required,]],
    banco: [[''], [Validators.required]],
    deudaHipotecaria: ['', [Validators.required,]],
    contribuciones: ['', [Validators.required,]],
    gastosOperacionales: ['', [Validators.required,]],
    rentaMensual: ['', [Validators.required,]],
    cae: ['', [Validators.required,]],
    liquidoCliente: ['', [Validators.required,]],
    valorContrato: ['', [Validators.required,]],
    obs_simulacion: []
  })

  canales: ITipoCanales[] = []
  bancos: IBancos[] = []

  permisos!: Record<string, any>;

  constructor(
    private fb: FormBuilder,
    private sTipoCanal: TipoSimulacionCanalService,
    private sBanco: BancoService,
    private sSimulador: SimuladorService,
    private sCliente: ClienteService,
    private sExportarPDF: ExportarPdfService,
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
    this.cargarDatosService()
    this.permisos = this.sPermiso.obtenerPermisos();
  }

  obtenerPermiso(modulo: string = '', categoria: string = '', subcategoria: string = ''): boolean {
    try {
      if (!modulo) return false;
      if (!categoria) return this.permisos[modulo].activo;
      if (!subcategoria) return this.permisos[modulo].categorias[categoria].activo;
      return this.permisos[modulo].categorias[categoria].subcategorias[subcategoria].activo;
    } catch (error) {
      return false;
    }
  }

  cargarDatosService() {
    this.sTipoCanal.obtenerTodosTipoCanales()
      .subscribe({
        next: ({ data }: ResultadoCanalesSimulacion) => {
          this.canales = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })

    this.sBanco.obtenerTodosBancos()
      .subscribe({
        next: ({ data }: ResultadoTodosBancos) => {
          this.bancos = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })

    this.obtenerSimulaciones();

  }

  obtenerSimulaciones() {
    this.sSimulador.obtenerTodasSimulacionPorCliente()
      .subscribe({
        next: ({ data }: ResultadoObtenerTodasSimulacionPorCliente) => {
          this.simulacionesCliente = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  abrirNuevaSimulacion(formulario: string) {

    this.sCliente.obtenerClientePorId()
      .subscribe({
        next: (response: ResultadoObtenerClienteById) => {

          this.formSimulacion.reset({
            moneda: 'UF',
            valorComercial: formateadorMilesDesdeBase(response.data.cli_valor_comercial),
            deudaHipotecaria: formateadorMilesDesdeBase(response.data.cli_deuda_estimada),
            gastosOperacionales: 100
          })

          abrirModal(formulario);
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  detalleSimulacion(formulario: string, simulacion: ISimulador) {
    this.simulacionDetalle = {
      id_simulacion: simulacion.id_simulacion,
      id_cliente: simulacion.id_cliente,
      id_ejecutivo: simulacion.id_ejecutivo,
      canal: simulacion.canal,
      banco: simulacion.banco,
      moneda: simulacion.moneda,
      valor_comercial: formateadorMilesDesdeBase(simulacion.valor_comercial),
      valor_contrato: formateadorMilesDesdeBase(simulacion.valor_contrato),
      descuento: simulacion.descuento,
      plazo_total: simulacion.plazo_total,
      plazo_prepago: simulacion.plazo_prepago,
      comision: formateadorMilesDesdeBase(simulacion.comision),
      deuda_hipotecaria: formateadorMilesDesdeBase(simulacion.deuda_hipotecaria),
      contribuciones: formateadorMilesDesdeBase(simulacion.contribuciones),
      gastos_operacionales: formateadorMilesDesdeBase(simulacion.gastos_operacionales),
      renta_mensual: formateadorMilesDesdeBase(simulacion.renta_mensual),
      cae: formateadorMilesDesdeBase(simulacion.cae),
      liquido_cliente: formateadorMilesDesdeBase(simulacion.liquido_cliente),
      obs: simulacion.obs,
      fecha_simulacion: simulacion.fecha_simulacion,
    }
    abrirModal(formulario);
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formSimulacion.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  soloNumeros(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = soloNumeros(input.value)
    this.formSimulacion.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  agregarCanal(tipoCanal: ITipoCanales) {
    if (tipoCanal) {
      this.sTipoCanal.obtenerComisionRentaById(tipoCanal.id_canal)
        .subscribe({
          next: ({ tipoCanales }: ResultadoComisionTasaByID) => {
            this.formSimulacion.patchValue({
              comision: formateadorMilesDesdeBase(tipoCanales.comision_canal),
              rentaMensual: formateadorMilesDesdeBase(tipoCanales.renta_mensual)
            })
            this.calcularSiluacion()
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.formSimulacion.patchValue({
        comision: [],
        rentaMensual: []
      })
    }
  }

  calcularSiluacion(): void {
    // Obtener y formatear todos los valores
    const valor_comercial = parseFloat(dejarNumeroBrutos(this.formSimulacion.get('valorComercial')?.value || 0));
    const plazo_prepagado = parseFloat(this.formSimulacion.get('plazoPrepago')?.value || 0);
    const descuento = parseFloat(this.formSimulacion.get('descuento')?.value || 0);
    const comision = parseFloat(dejarNumeroBrutos(this.formSimulacion.get('comision')?.value || 0));
    const deuda_hipotecaria = parseFloat(dejarNumeroBrutos(this.formSimulacion.get('deudaHipotecaria')?.value || 0));
    const contribuciones = parseFloat(dejarNumeroBrutos(this.formSimulacion.get('contribuciones')?.value || 0));
    const gastos_operacionales = parseFloat(dejarNumeroBrutos(this.formSimulacion.get('gastosOperacionales')?.value || 0));
    const renta_mensual = parseFloat(dejarNumeroBrutos(this.formSimulacion.get('rentaMensual')?.value || 0));

    //inicio de formulas
    //formula para sacar liquido
    let valor_contrato = valor_comercial * (descuento / 100);
    let costo_anual = valor_contrato * plazo_prepagado * (renta_mensual / 100);
    let administracion = (valor_contrato * (comision / 100)) * 1.19;
    let montoPreAprobado = valor_contrato - costo_anual - administracion - gastos_operacionales - deuda_hipotecaria - contribuciones;

    //formula para el CAE
    let fCae = (administracion + costo_anual + gastos_operacionales) / (montoPreAprobado + deuda_hipotecaria + contribuciones) || 0;
    fCae = (fCae < 0) ? 0 : fCae;
    this.formSimulacion.patchValue({
      valorContrato: formateadorMiles(valor_contrato.toString()),
      cae: formateadorMilesDesdeBase(fCae.toString()),
      liquidoCliente: formateadorMilesDesdeBase(montoPreAprobado.toString())
    }, { emitEvent: false })

  }

  crearSimulacion(): void {
    this.sSimulador.crearNuevaSimulacion(this.formSimulacion.value)
      .subscribe({
        next: (response: ResultadoCrearSimulacion) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Warning,
            titulo: response.ok ? 'Exito' : "Atención",
            mensaje: response.data.mensaje
          })
          if (response.ok) {
            cerrarModal()
            this.obtenerSimulaciones();
          }

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  descargarSimulacion(simulacion: ISimulador) {
    this.sExportarPDF.exportarSimulacionPdf(simulacion.id_simulacion)
      .subscribe({
        next: (response: exportarPdf) => {
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
          console.log(error);

          errorConexionServidor(error);
        }
      });
  }


}
