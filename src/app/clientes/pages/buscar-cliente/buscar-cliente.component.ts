import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

import { nombreApellidoEjecutivoId, ResultadoObtenerEjecutivoYbroker, ResultadoObtenerTodosClientes, TodosClientes } from 'src/app/interfaces/cliente';

import { ClienteService } from 'src/app/services/cliente.service';
import { ExportarExcelService } from 'src/app/services/exportar-excel.service';
import { UsuarioService } from 'src/app/services/usuario.service';

import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { validarFechas } from 'src/app/shared/utils/validadores';


@Component({
  selector: 'cliente-buscar',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.css']
})
export class BuscarClienteComponent implements OnInit {

  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;
  ;
  loading: boolean = true;
  clientes: TodosClientes[] = []
  selectEjecutivosBrokers: nombreApellidoEjecutivoId[] = [];
  estados = [
    { id_estado: '1', nombre_estado: 'Rechazado' },
    { id_estado: '2', nombre_estado: 'No Asignado' },
    { id_estado: '3', nombre_estado: 'Asignado' },
    { id_estado: '4', nombre_estado: 'Pre-Aprobado' },
    { id_estado: '5', nombre_estado: 'Comité' },
    { id_estado: '6', nombre_estado: 'Exclusivo' },
    { id_estado: '7', nombre_estado: 'Pre-Cursado' },
    { id_estado: '8', nombre_estado: 'Cursado' },
  ];

  formFiltroBusqueda: FormGroup = this.fb.group({
    id_cliente: ['', []],
    estado: [, []],
    ejecutivo: [, []],
    fechaDesde: ['', []],
    fechaHasta: ['', []],
  }, {
    validators: validarFechas('fechaDesde', 'fechaHasta')
  });

  constructor(
    private fb: FormBuilder,
    private sCliente: ClienteService,
    private sUsuario: UsuarioService,
    private sExportar: ExportarExcelService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.obtenerClientePorFiltro();
    this.selectEjecutivoBroker();
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  obtenerClientePorFiltro() {
    this.sCliente.obtenerClientesPorFiltro(this.formFiltroBusqueda.value)
      .subscribe({
        next: (resultado: ResultadoObtenerTodosClientes) => {
          this.clientes = resultado.data
          this.loading = false;
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        },
      });
  }

  borrarFiltrosTabla() {
    if (this.formFiltroBusqueda.get('id_cliente')?.value === ''
      && this.formFiltroBusqueda.get('estado')?.value === '' && this.formFiltroBusqueda.get('ejecutivo')?.value === null
      && this.formFiltroBusqueda.get('fechaDesde')?.value === null && this.formFiltroBusqueda.get('fechaHasta')?.value === null) return

    this.formFiltroBusqueda.reset();

    this.obtenerClientePorFiltro()
    return
  }

  selectEjecutivoBroker() {
    this.sUsuario.obtenerEjecutivosBrokers()
      .subscribe({
        next: ({ data }: ResultadoObtenerEjecutivoYbroker) => {
          this.selectEjecutivosBrokers = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      });
  }

  irDetalleCliente(id_cliente: string): void {
    this.router.navigate(['/cliente', id_cliente])
  }

  exportarExcel() {
    let fechaHoy = new Date().toLocaleDateString();
    let nombreArchivo = `exportarCliente_${fechaHoy}.xlsx`;

    this.sExportar.exportarCliente(this.formFiltroBusqueda.value)
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
}
