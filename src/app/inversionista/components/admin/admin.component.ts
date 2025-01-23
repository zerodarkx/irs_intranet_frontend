import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { nombreApellidoEjecutivoId, Comuna, DataContador, obtenerComentarioPorInversionista, ObtenerTodosInversionesPorEstado, ResultadoAgregarCasoNuevoReserva, ResultadoObtenerDataInversionista, ResultadoObtenerTodosInversionesContador, ResultadoObtenerTodosInversionesPorEstado, Iregiones, TipoPropiedad, ResultadoObtenerSelectInversionistaDisponibles, SelectInversionistaDisponibles } from 'src/app/interfaces';
import { ComunaService, ExportarExcelService, InversionistasService, RegionService, TipoPropiedadService, UsuarioService } from 'src/app/services';

import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { dejarNumeroBrutos, formateadorMiles, formateadorMilesDesdeBase } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { validarFechas } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  contadorTemporal: DataContador = { cantidad: 0, estado: 0, titulo: '', montoTotal: 0 };
  contadorDatosDisponibles: DataContador = { cantidad: 0, estado: 0, titulo: 'Disponibles', montoTotal: 0 };
  contadorDatosComite: DataContador = { cantidad: 0, estado: 1, titulo: 'Comite', montoTotal: 0 };
  contadorDatosPendiente: DataContador = { cantidad: 0, estado: 2, titulo: 'Pendiente', montoTotal: 0 };
  contadorDatosRechazado: DataContador = { cantidad: 0, estado: 3, titulo: 'Rechazado', montoTotal: 0 };
  contadorDatosDesistido: DataContador = { cantidad: 0, estado: 4, titulo: 'Desistido', montoTotal: 0 };
  contadorDatosPreAprobado: DataContador = { cantidad: 0, estado: 5, titulo: 'Pre Aprobado', montoTotal: 0 };
  contadorDatosAprobado: DataContador = { cantidad: 0, estado: 6, titulo: 'Aprobado', montoTotal: 0 };
  contadorDatosCursado: DataContador = { cantidad: 0, estado: 7, titulo: 'Cursado', montoTotal: 0 };

  datosMostar: ObtenerTodosInversionesPorEstado[] = []
  detallePorCaso?: ObtenerTodosInversionesPorEstado;
  comentarioCaso: obtenerComentarioPorInversionista[] = [];
  estadoMostrar: number = 0;
  tituloMostrar: string = 'Disponibles';

  dataInversor: boolean = false;
  total_inversion: number = 0;
  rentabilidad: number = 0;

  selectInversionistaDisponibles: SelectInversionistaDisponibles[] = [];

  selectEjecutivos: nombreApellidoEjecutivoId[] = []
  selectInversionista: SelectInversionistaDisponibles[] = []
  selectTipoPropiedad: TipoPropiedad[] = []
  selectRegiones: Iregiones[] = []
  selectComunas: Comuna[] = []

  formAsignarAComite: FormGroup = this.fb.group({
    id_inv: [[], [
      Validators.required
    ]],
    tir: ['', [
      Validators.required
    ]],
    id_cliente: []
  });

  formCamioEstado: FormGroup = this.fb.group({
    id_inv: [],
    tir: ['', [
      Validators.required
    ]],
    id_cliente: [],
    estado_reserva: [[], [
      Validators.required
    ]],
    id_reserva: []
  });

  formComentario: FormGroup = this.fb.group({
    id_cliente: [],
    id_inversionista: [],
    comentario: ['', [
      Validators.required
    ]]
  });

  formExportar: FormGroup = this.fb.group({
    id_ejecutivo: [],
    id_inversionista: [],
    tipo_propiedad: [],
    estado: [],
    fecha_cursado: this.fb.group({
      fechaDesde: [, []],
      fechaHasta: [, []],
    }, { validators: [validarFechas('fechaDesde', 'fechaHasta')] }),
    region: [],
    comuna: []
  });

  constructor(
    private fb: FormBuilder,
    private sInversionista: InversionistasService,
    private sUsuario: UsuarioService,
    private sTipoPropiedad: TipoPropiedadService,
    private sExportar: ExportarExcelService,
    private sRegion: RegionService,
    private sComuna: ComunaService
  ) { }

  ngOnInit(): void {
    this.obtenerContadorCasos();
    this.mostratCasosDisponibles();
    this.cargarDatosParaExportar();
    this.otenerRegiones();
    this.formExportar.get('fecha_cursado')?.disable();
  }

  ngAfterViewInit() {
    this.calcularAlturaMaxima('.tamanoCard');
    this.calcularAlturaMaxima('.tamanoTexto1');
    this.calcularAlturaMaxima('.tamanoTexto2');
  }

  calcularAlturaMaxima(query: string) {
    const tarjetas = document.querySelectorAll(query);
    let maxHeight = 0;

    tarjetas.forEach((tarjeta: any) => {
      const altura = tarjeta.offsetHeight;
      if (altura > maxHeight) {
        maxHeight = altura;
      }
    });

    tarjetas.forEach((tarjeta: any) => {
      tarjeta.style.height = `${maxHeight}px`;
    })
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  formatearMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formAsignarAComite.get(input.getAttribute('formControlName')!)?.setValue(input.value)
    this.formCamioEstado.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  obtenerContadorCasos() {
    this.sInversionista.obtenerTodosInversionistaContador()
      .subscribe({
        next: (response: ResultadoObtenerTodosInversionesContador) => {
          this.contadorDatosPendiente = response.data.Pendiente || this.contadorDatosPendiente;
          this.contadorDatosComite = response.data.Comite || this.contadorDatosComite;
          this.contadorDatosRechazado = response.data.Rechazado || this.contadorDatosRechazado;
          this.contadorDatosDesistido = response.data.Desistido || this.contadorDatosDesistido;
          this.contadorDatosPreAprobado = response.data.PreAprobado || this.contadorDatosPreAprobado;
          this.contadorDatosAprobado = response.data.Aprobado || this.contadorDatosAprobado;
          this.contadorDatosCursado = response.data.Cursado || this.contadorDatosCursado;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  mostrarDataPorEstado(data: DataContador) {
    this.contadorTemporal = data;
    this.estadoMostrar = data.estado;
    this.tituloMostrar = data.titulo;
    this.sInversionista.obtenerTodosInversionesPorEstado(data.estado)
      .subscribe({
        next: (response: ResultadoObtenerTodosInversionesPorEstado) => {
          this.datosMostar = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  mostratCasosDisponibles() {
    this.estadoMostrar = 0;
    this.tituloMostrar = 'Disponible'

    this.sInversionista.obtenerTodosInversionesDisponibles()
      .subscribe({
        next: (response: ResultadoObtenerTodosInversionesPorEstado) => {
          this.datosMostar = response.data;
          this.contadorDatosDisponibles.cantidad = response.data.filter(data => data).length
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  abrirModal(detalle: ObtenerTodosInversionesPorEstado) {
    this.detallePorCaso = detalle;

    if (this.detallePorCaso) {
      this.dataInversor = true;
      this.formCamioEstado.patchValue({
        id_cliente: this.detallePorCaso.id,
        tir: formateadorMilesDesdeBase(this.detallePorCaso.tir),
        id_inv: this.detallePorCaso.id_inversionista,
        estado_reserva: this.estadoMostrar,
        id_reserva: this.detallePorCaso.id_reserva
      })
      this.total_inversion = this.detallePorCaso.v_contrato / ((100 + this.detallePorCaso.tir) / 100);
      this.rentabilidad = this.detallePorCaso.v_contrato - this.total_inversion;
    }
    abrirModal('modalDetalleCaso');
  }

  abrirModalCasoDisponible(detalle: ObtenerTodosInversionesPorEstado) {
    this.detallePorCaso = detalle;
    this.formAsignarAComite.reset();
    this.dataInversor = false;

    this.sUsuario.obtenerSelectInversionistaDisponibles(detalle.id)
      .subscribe({
        next: (response: ResultadoObtenerSelectInversionistaDisponibles) => {
          this.selectInversionistaDisponibles = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });

    abrirModal('modalDetalleCasoDisponible');
  }

  mostrarDataInversionistaOnChangeSelect(event: SelectInversionistaDisponibles | undefined) {
    if (event?.id_inv) {
      this.dataInversor = true;
      this.sInversionista.obtenerDataInverionista(event?.id_inv)
        .subscribe({
          next: (response: ResultadoObtenerDataInversionista) => {
            if (this.detallePorCaso) {
              this.formAsignarAComite.patchValue({
                id_cliente: this.detallePorCaso.id,
                tir: formateadorMilesDesdeBase(response.data.tir)
              })
              this.total_inversion = this.detallePorCaso.v_contrato / ((100 + response.data.tir) / 100);
              this.rentabilidad = this.detallePorCaso.v_contrato - this.total_inversion;
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error);
          }
        })
    } else {
      this.dataInversor = false;
    }
  }

  cambiarTirInput(event: Event) {
    if (this.detallePorCaso) {
      const input = (event.target as HTMLInputElement).value;
      let tir = dejarNumeroBrutos(input);
      this.total_inversion = this.detallePorCaso.v_contrato / ((100 + parseFloat(tir)) / 100);
      this.rentabilidad = this.detallePorCaso.v_contrato - this.total_inversion;
    }
  }

  aceptarCasoAComite() {
    this.sInversionista.agregarCasoNuevoReserva(this.formAsignarAComite.value)
      .subscribe({
        next: (response: ResultadoAgregarCasoNuevoReserva) => {
          if (response.ok) {
            this.obtenerContadorCasos();
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: "Exito",
              mensaje: response.mensaje
            });
            cerrarModal();
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })

  }

  cambiarDeEstadoDeReserva() {
    this.sInversionista.cambiarDeEstadoDeReserva(this.formCamioEstado.value)
      .subscribe({
        next: (response: ResultadoAgregarCasoNuevoReserva) => {
          if (response.ok) {
            this.obtenerContadorCasos();
            this.mostrarDataPorEstado(this.contadorTemporal);
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: "Exito",
              mensaje: response.mensaje
            });
            cerrarModal();
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })

  }

  cargarComentario() {
    if (!this.detallePorCaso) return
    this.sInversionista.obtenerComentarioPorInversionista(this.detallePorCaso?.id, this.detallePorCaso?.id_inversionista)
      .subscribe({
        next: (response) => {
          this.comentarioCaso = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
    this.formComentario.patchValue({
      id_cliente: this.detallePorCaso.id,
      id_inversionista: this.detallePorCaso.id_inversionista
    })
  }

  modalComentario() {
    this.cargarComentario()
    abrirModal('modalComentarios')
  }

  guardarComentario() {
    this.sInversionista.agregarComentarioPorInversionista(this.formComentario.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            titulo: '',
            mensaje: response.mensaje
          });

          if (response.ok) {
            this.cargarComentario();
            this.formComentario.reset();
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  borrarFiltrosTablaExportar() {
    this.formExportar.reset();
    this.formExportar.get('fecha_cursado')?.disable();
  }

  cargarDatosParaExportar() {
    // ejecutivos
    this.sUsuario.obtenerEjecutivosBrokers()
      .subscribe({
        next: (response) => {
          this.selectEjecutivos = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
    // inversionistas
    this.sUsuario.obtenerSelectInversionista()
      .subscribe({
        next: (response) => {
          this.selectInversionista = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
    // tipo propiedades
    this.sTipoPropiedad.obtenerTodasLosTipoPropiedad()
      .subscribe({
        next: (response) => {
          this.selectTipoPropiedad = response.data;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  exportarCasosExcel() {
    let fechaHoy = new Date().toLocaleDateString();
    let nombreArchivo = `exportarCasosInversionista_${fechaHoy}.xlsx`;

    this.sExportar.exportarCasosInversionistas(this.formExportar.getRawValue())
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = nombreArchivo;
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

  estadoCursadoFiltro(estado: string) {
    const fechaCursadoGroup = this.formExportar.get('fecha_cursado');
    if (estado === '7') {
      fechaCursadoGroup?.enable();
    } else {
      fechaCursadoGroup?.disable();
      fechaCursadoGroup?.reset();
    }
  }

  otenerRegiones() {
    this.sRegion.obtenerTodasLasRegiones()
      .subscribe({
        next: ({ data }) => {
          this.selectRegiones = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  changeComuna(event: Iregiones): void {

    const region = event?.id_region
    this.selectComunas = []
    this.formExportar.get('comuna')?.reset();

    // modificar esta parte de aca para generarse de forma automatica
    if (region) {
      this.sComuna.obtenerComunasPorRegion(region)
        .subscribe({
          next: ({ data }) => {
            this.selectComunas = data
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error);
          }
        });
    }
  }
}