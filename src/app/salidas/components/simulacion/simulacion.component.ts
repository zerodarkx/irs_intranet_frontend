import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErrorHttpCustom, IBancos, ISimulador, ITipoCanales } from 'src/app/interfaces';
import { BancoService, ClienteService, ExportarPdfService, PermisosService, SimuladorService, TipoSimulacionCanalService } from 'src/app/services';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

import { dejarNumeroBrutos, formateadorMiles, formateadorMilesDesdeBase, soloNumeros } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-simulacion',
  templateUrl: './simulacion.component.html',
  styleUrls: ['./simulacion.component.css']
})
export class SimulacionComponent {
  @ViewChild('modaldetalleSimulacion') modaldetalleSimulacion!: ModalComponent;
  @ViewChild('modalnuevaSimulacion') modalnuevaSimulacion!: ModalComponent;

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
    if (!modulo) return false;

    const moduloData = this.permisos[modulo];
    if (!moduloData) return false;

    if (!categoria) return moduloData.activo;

    const categoriaData = moduloData.categorias?.[categoria];
    if (!categoriaData) return false;

    if (!subcategoria) return categoriaData.activo;

    return categoriaData.subcategorias?.[subcategoria]?.activo ?? false;
  }

  cargarDatosService() {
    this.sTipoCanal.obtenerTodosTipoCanalesPorPermiso()
      .subscribe({
        next: ({ data }) => {
          this.canales = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })

    this.sBanco.obtenerTodosBancos()
      .subscribe({
        next: ({ data }) => {
          this.bancos = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })

    this.obtenerSimulaciones();

  }

  obtenerSimulaciones() {
    this.sSimulador.obtenerTodasSimulacionPorCliente()
      .subscribe({
        next: ({ data }) => {
          this.simulacionesCliente = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  abrirNuevaSimulacion() {
    this.sCliente.obtenerClientePorId()
      .subscribe({
        next: (response) => {

          this.formSimulacion.reset({
            moneda: 'UF',
            valorComercial: formateadorMilesDesdeBase(response.data.cli_valor_comercial),
            deudaHipotecaria: formateadorMilesDesdeBase(response.data.cli_deuda_estimada),
            gastosOperacionales: 100
          })

          this.modalnuevaSimulacion.abrirModal();
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  detalleSimulacion(simulacion: ISimulador) {
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
    this.modaldetalleSimulacion.abrirModal();
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
          next: ({ tipoCanales }) => {
            this.formSimulacion.patchValue({
              comision: formateadorMilesDesdeBase(tipoCanales.comision_canal),
              rentaMensual: formateadorMilesDesdeBase(tipoCanales.renta_mensual)
            })
            this.calcularSiluacion()
          },
          error: (error: ErrorHttpCustom) => {
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
    const descuento = parseFloat(dejarNumeroBrutos(this.formSimulacion.get('descuento')?.value || 0));
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
      valorContrato: formateadorMilesDesdeBase(valor_contrato.toString()),
      cae: formateadorMilesDesdeBase(fCae.toString()),
      liquidoCliente: formateadorMilesDesdeBase(montoPreAprobado.toString())
    }, { emitEvent: false })

  }

  descargarSimulacion(simulacion: ISimulador) {
    this.sExportarPDF.exportarSimulacionPdf(simulacion.id_simulacion)
      .subscribe({
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
        error: (error: ErrorHttpCustom) => {
          console.log(error);

          errorConexionServidor(error);
        }
      });
  }
}