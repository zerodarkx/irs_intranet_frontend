import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import {
  DataContador, ObtenerTodosInversionesPorEstado, ResultadoAgregarCasoNuevoReserva, ResultadoObtenerDataInversionista,
  ResultadoObtenerTodosInversionesContador, ResultadoObtenerTodosInversionesPorEstado
} from 'src/app/interfaces/inversionista';
import { ResultadoObtenerSelectInversionistaDisponibles, SelectInversionistaDisponibles } from 'src/app/interfaces/usuario';
import { InversionistasService } from 'src/app/services/inversionistas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { dejarNumeroBrutos, formateadorMiles, formateadorMilesDesdeBase } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {

  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;


  contadorTemporal: DataContador = { cantidad: 0, estado: 0, titulo: '' };
  contadorDatosDisponibles: DataContador = { cantidad: 0, estado: 0, titulo: 'Disponibles' };
  contadorDatosComite: DataContador = { cantidad: 0, estado: 1, titulo: 'Comite' };
  contadorDatosPendiente: DataContador = { cantidad: 0, estado: 2, titulo: 'Pendiente' };
  contadorDatosRechazado: DataContador = { cantidad: 0, estado: 3, titulo: 'Rechazado' };
  contadorDatosDesistido: DataContador = { cantidad: 0, estado: 4, titulo: 'Desistido' };
  contadorDatosPreAprobado: DataContador = { cantidad: 0, estado: 5, titulo: 'Pre Aprobado' };
  contadorDatosAprobado: DataContador = { cantidad: 0, estado: 6, titulo: 'Aprobado' };
  contadorDatosCursado: DataContador = { cantidad: 0, estado: 7, titulo: 'Cursado' };

  datosMostar: ObtenerTodosInversionesPorEstado[] = []
  detallePorCaso?: ObtenerTodosInversionesPorEstado;
  estadoMostrar: number = 0;
  tituloMostrar: string = 'Disponibles';

  dataInversor: boolean = false;
  total_inversion: number = 0;
  rentabilidad: number = 0;

  selectInversionistaDisponibles: SelectInversionistaDisponibles[] = [];

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

  constructor(
    private fb: FormBuilder,
    private sInversionista: InversionistasService,
    private sUsuario: UsuarioService
  ) { }

  ngOnInit(): void {
    this.obtenerContadorCasos();
    this.mostratCasosDisponibles();
  }

  ngAfterViewInit() {
    this.calcularAlturaMaxima('.card .text-white');
    this.calcularAlturaMaxima('.tamano');
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
  }

  obtenerContadorCasos() {
    this.sInversionista.obtenerTodosInversionistaContador()
      .subscribe({
        next: (response: ResultadoObtenerTodosInversionesContador) => {
          this.contadorDatosComite.cantidad = response.data.Comite.cantidad ?? 0;
          this.contadorDatosPendiente.cantidad = response.data.Pendiente.cantidad ?? 0;
          this.contadorDatosRechazado.cantidad = response.data.Rechazado.cantidad ?? 0;
          this.contadorDatosDesistido.cantidad = response.data.Desistido.cantidad ?? 0;
          this.contadorDatosPreAprobado.cantidad = response.data.PreAprobado?.cantidad ?? 0;
          this.contadorDatosAprobado.cantidad = response.data.Aprobado.cantidad ?? 0;
          this.contadorDatosCursado.cantidad = response.data.Cursado.cantidad ?? 0;
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
}
