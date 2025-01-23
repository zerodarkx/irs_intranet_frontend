import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';

import { nombreApellidoEjecutivoId, ResultadoObtenerEjecutivoYbroker, ResultadoObtenerTodosClientes, TodosClientes, Estados } from 'src/app/interfaces';
import { ClienteService, ExportarExcelService, PermisosService, UsuarioService } from 'src/app/services';

import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';
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
  clientes: TodosClientes[] = []
  selectEjecutivosBrokers: nombreApellidoEjecutivoId[] = [];
  estadosMostrar: Estados[] = [
    { id_estado: 1, nombre_estado: 'Rechazado', det_estado: 'EST_RECHAZADO' },
    { id_estado: 2, nombre_estado: 'No Asignado', det_estado: 'EST_PENDIENTE' },
    { id_estado: 3, nombre_estado: 'Asignado', det_estado: 'EST_ASIGNADO' },
    { id_estado: 4, nombre_estado: 'Pre-Aprobado', det_estado: 'EST_PREAPROBADO' },
    { id_estado: 5, nombre_estado: 'Comité', det_estado: 'EST_COMITE' },
    { id_estado: 6, nombre_estado: 'Exclusivo', det_estado: 'EST_EXCLUSIVO' },
    { id_estado: 7, nombre_estado: 'Pre-Cursado', det_estado: 'EST_PRECURSADO' },
    { id_estado: 8, nombre_estado: 'Cursado', det_estado: 'EST_CURSADO' },
  ]

  formFiltroBusqueda: FormGroup = this.fb.group({
    id_cliente: ['', []],
    estado: [, []],
    ejecutivo: [, []],
    fechasIngreso: this.fb.group({
      fechaDesde: ['', []],
      fechaHasta: ['', []],
    }, { validators: [validarFechas('fechaDesde', 'fechaHasta')] }),
    fechasCursado: this.fb.group({
      fechaDesde: ['', []],
      fechaHasta: ['', []],
    }, { validators: [validarFechas('fechaDesde', 'fechaHasta')] }),
  });

  permisos!: Record<string, any>;

  constructor(
    private fb: FormBuilder,
    private sCliente: ClienteService,
    private sUsuario: UsuarioService,
    private sExportar: ExportarExcelService,
    private router: Router,
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
    this.permisos = this.sPermiso.obtenerPermisos();
    this.obtenerEstados();
    this.selectEjecutivoBroker();

    const formulario = localStorage.getItem('filtrosBusqueda')
    if (formulario) {
      this.formFiltroBusqueda.patchValue(JSON.parse(formulario))
      this.obtenerClientePorFiltro()
    }
  }

  obtenerPermiso(modulo: string = '', categoria: string = '', subcategoria: string = '') {
    try {
      if (!modulo) return false;
      if (!categoria) return this.permisos[modulo].activo
      if (!subcategoria) return this.permisos[modulo].categorias[categoria].activo
      return this.permisos[modulo].categorias[categoria].subcategorias[subcategoria].activo
    } catch (error) {
      return false;
    }
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  obtenerEstados() {
    let permisos = this.sPermiso.obtenerPermisosBrutos();
    const dataModulo = permisos.find(modulo => modulo.nombre == 'Cliente');
    const dataCategoria = dataModulo?.categorias?.find(categoria => categoria.nombre == 'Estados Cliente');

    this.estadosMostrar = this.estadosMostrar.filter((estado) =>
      dataCategoria?.subcategorias!.some((categoria) => categoria.permiso === estado.det_estado && categoria.activo)
    );
  }

  obtenerClientePorFiltro() {
    this.sCliente.obtenerClientesPorFiltro(this.formFiltroBusqueda.value)
      .subscribe({
        next: (resultado: ResultadoObtenerTodosClientes) => {
          localStorage.setItem('filtrosBusqueda', JSON.stringify(this.formFiltroBusqueda.value));
          this.clientes = resultado.data
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
