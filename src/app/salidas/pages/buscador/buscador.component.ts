import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { ClientesSalida, ErrorHttpCustom, nombreApellidoEjecutivoId, SelectInversionistaDisponibles, TipoSalidas, TipoSubSalidas } from 'src/app/interfaces';

import { ExportarExcelService, PermisosService, SalidasService, TipoSalidasService, UsuarioService } from 'src/app/services';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

import { validarFechas } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  clientes: ClientesSalida[] = []
  tipoSalida: TipoSalidas[] = []
  tipoSubSalida: TipoSubSalidas[] = []
  selectEjecutivosBrokers: nombreApellidoEjecutivoId[] = [];
  selectInversionista: SelectInversionistaDisponibles[] = []

  formFiltroBusqueda: FormGroup = this.fb.group({
    id_cliente: [, []],
    estado: [, []],
    subEstado: [, []],
    ejecutivo: [, []],
    fechasCursado: this.fb.group({
      fechaDesde: [, []],
      fechaHasta: [, []],
    }, { validators: [validarFechas('fechaDesde', 'fechaHasta')] }),
    inversionista: [, []],
    caso_activo: [1, []]
  });

  permisos!: Record<string, any>;

  constructor(
    private fb: FormBuilder,
    private sSalidas: SalidasService,
    private router: Router,
    private sTipoSalida: TipoSalidasService,
    private sUsuario: UsuarioService,
    private sPermiso: PermisosService,
    private sExportar: ExportarExcelService
  ) { }

  ngOnInit(): void {
    this.permisos = this.sPermiso.obtenerPermisos();
    this.selectEjecutivoBroker();
    this.obtenerTipoSalidas();
    this.obtenerSelectInversionistas();

    const formularioCache = localStorage.getItem('filtrosBusquedaSalidas')
    if (formularioCache) {
      this.formFiltroBusqueda.patchValue(JSON.parse(formularioCache))
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

  borrarFiltrosTabla() {
    this.formFiltroBusqueda.reset();
    this.obtenerClientePorFiltro();
    localStorage.removeItem('filtrosBusquedaSalidas')
    return
  }

  obtenerTipoSalidas() {
    this.sTipoSalida.obtenerTodosTipoSalidas()
      .subscribe({
        next: (response) => {
          this.tipoSalida = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
    this.sTipoSalida.obtenerTodosTipoSubSalidas()
      .subscribe({
        next: (response) => {
          this.tipoSubSalida = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
  }

  obtenerClientePorFiltro() {
    this.sSalidas.obtenerTodosClienteSalida(this.formFiltroBusqueda.value)
      .subscribe({
        next: (response) => {
          this.clientes = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      })
  }

  exportarExcel() {
    let fechaHoy = new Date().toLocaleDateString();
    let nombreArchivo = `exportarCliente_${fechaHoy}.xlsx`;

    this.sExportar.exportarCasosSalidas(this.formFiltroBusqueda.value)
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
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
  }

  irDetalleCliente(id_cliente: number) {
    localStorage.setItem('filtrosBusquedaSalidas', JSON.stringify(this.formFiltroBusqueda.value));
    this.router.navigate(['/salidas', id_cliente])
  }

  selectEjecutivoBroker() {
    this.sUsuario.obtenerEjecutivosBrokers()
      .subscribe({
        next: (response) => {
          this.selectEjecutivosBrokers = response.data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      });
  }

  obtenerSelectInversionistas() {
    this.sUsuario.obtenerSelectInversionista()
      .subscribe({
        next: (response) => {
          this.selectInversionista = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }


}
