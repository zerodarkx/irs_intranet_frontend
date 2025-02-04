import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { DataObtenerTodosDocumentosCliente } from 'src/app/interfaces';
import { ClienteService, PermisosService } from 'src/app/services';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

import { env } from 'src/environments/environment';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent {

  url: string = env.descargaUrl;
  fechaNueva: string = new Date().getTime().toString();
  permisos!: Record<string, any>;

  //documentos e imagenes cargados en sistema
  documentosCargadosCliente: DataObtenerTodosDocumentosCliente[] = [];

  constructor(
    private sCliente: ClienteService,
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
    this.cargarDocumentosEnSistema();
    this.permisos = this.sPermiso.obtenerPermisos();
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

  cargarDocumentosEnSistema() {
    this.sCliente.mostrarTodosDocumentosCliente()
      .subscribe({
        next: ({ data }) => {
          this.fechaNueva = new Date().getTime().toString();
          this.documentosCargadosCliente = data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }
}
