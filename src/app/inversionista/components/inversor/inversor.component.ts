import { Component, ElementRef, ViewChild } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Table } from 'primeng/table';

import { Payload, DataContador, DocumentosPorInversionista, ObtenerTodosInversionesPorEstado, ResultadoObtenerTodosInversionesContador, ResultadoObtenerTodosInversionesPorEstado, SelectInversionistaDisponibles, ErrorHttpCustom } from 'src/app/interfaces';
import { ExportarPdfService, InversionistasService } from 'src/app/services';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

import { formateadorMilesDesdeBase } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

import { env } from 'src/environments/environment';

@Component({
  selector: 'inversionista-inversor',
  templateUrl: './inversor.component.html',
  styleUrls: ['./inversor.component.css']
})
export class InversorComponent {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;
  @ViewChild('modalDetalleCaso') modalDetalleCaso!: ModalComponent;
  @ViewChild('modalDocumentos') modalDocumentos!: ModalComponent;

  url: string = env.descargaUrl;

  contadorTemporal: DataContador = { cantidad: 0, estado: 0, titulo: '', montoTotal: 0 };
  contadorDatosComite: DataContador = { cantidad: 0, estado: 1, titulo: 'Comite', montoTotal: 0 };
  contadorDatosPendiente: DataContador = { cantidad: 0, estado: 2, titulo: 'Pendiente', montoTotal: 0 };
  contadorDatosRechazado: DataContador = { cantidad: 0, estado: 3, titulo: 'Rechazado', montoTotal: 0 };
  contadorDatosDesistido: DataContador = { cantidad: 0, estado: 4, titulo: 'Desistido', montoTotal: 0 };
  contadorDatosPreAprobado: DataContador = { cantidad: 0, estado: 5, titulo: 'Pre Aprobado', montoTotal: 0 };
  contadorDatosAprobado: DataContador = { cantidad: 0, estado: 6, titulo: 'Aprobado', montoTotal: 0 };
  contadorDatosCursado: DataContador = { cantidad: 0, estado: 7, titulo: 'Cursado', montoTotal: 0 };

  id_inv: number = 0;
  datosMostar: ObtenerTodosInversionesPorEstado[] = []
  detallePorCaso?: ObtenerTodosInversionesPorEstado;
  documentosPorInversionista: DocumentosPorInversionista[] = [];
  tituloMostrar: string = '';

  total_inversion: number = 0;
  rentabilidad: number = 0;
  tir: string = '';

  selectInversionistaDisponibles: SelectInversionistaDisponibles[] = [];

  constructor(
    private sInversionista: InversionistasService,
    private sExportarPDF: ExportarPdfService
  ) { }

  ngOnInit(): void {
    this.id_inv = jwtDecode<Payload>(localStorage.getItem('token')!).id_usuario;
    this.obtenerContadorCasos();
    this.mostrarDataPorEstado(this.contadorDatosComite);
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

  obtenerContadorCasos() {
    this.sInversionista.obtenerTodosInversionistaContadorByInversionista(this.id_inv)
      .subscribe({
        next: (response) => {
          this.contadorDatosPendiente = response.data.Pendiente || this.contadorDatosPendiente;
          this.contadorDatosComite = response.data.Comite || this.contadorDatosComite;
          this.contadorDatosRechazado = response.data.Rechazado || this.contadorDatosRechazado;
          this.contadorDatosDesistido = response.data.Desistido || this.contadorDatosDesistido;
          this.contadorDatosPreAprobado = response.data.PreAprobado || this.contadorDatosPreAprobado;
          this.contadorDatosAprobado = response.data.Aprobado || this.contadorDatosAprobado;
          this.contadorDatosCursado = response.data.Cursado || this.contadorDatosCursado;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  mostrarDataPorEstado(data: DataContador) {
    this.contadorTemporal = data;
    this.tituloMostrar = data.titulo;
    this.sInversionista.obtenerTodosInversionesPorEstadoByInversionista(this.id_inv, data.estado)
      .subscribe({
        next: (response) => {
          this.datosMostar = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      })
  }

  abrirModalDetalle(detalle: ObtenerTodosInversionesPorEstado) {
    this.detallePorCaso = detalle;
    this.tir = formateadorMilesDesdeBase(this.detallePorCaso.tir);
    this.total_inversion = this.detallePorCaso.v_contrato / ((100 + this.detallePorCaso.tir) / 100);
    this.rentabilidad = this.detallePorCaso.v_contrato - this.total_inversion;
    this.modalDetalleCaso.abrirModal()
    
  }

  abrirmodalDocumentos() {
    if (!this.detallePorCaso) return
    this.sInversionista.obtenerDocumentosPorInversionista(this.detallePorCaso.id_inversionista, this.detallePorCaso.id)
      .subscribe({
        next: (response) => {
          this.documentosPorInversionista = response.data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
      this.modalDocumentos.abrirModal()
  }

  exportarFichaPdf() {
    if (!this.detallePorCaso) return
    const data = {
      id_cliente: this.detallePorCaso.id,
      id_inversionista: this.detallePorCaso.id_inversionista
    }
    this.sExportarPDF.exportarFichaInversionistaPdf(data)
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
          errorConexionServidor(error);
        }
      });
  }
}
