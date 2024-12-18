import { Component, OnInit } from '@angular/core';
import { SubModuloCliente } from 'src/app/interfaces/menu';
import { PermisosService } from 'src/app/services/permisos.service';
import { PermisosModulo } from 'src/app/interfaces/usuario';

@Component({
  selector: 'cliente-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  permisos!: Record<string, any>;

  constructor(
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
    this.permisos = this.sPermiso.obtenerPermisos();
  }

  obtenerPermiso(modulo: string = '', categoria: string = '', subcategoria: string = '') {
    if (!modulo) return false;
    if (!categoria) return this.permisos[modulo].activo
    if (!subcategoria) return this.permisos[modulo].categorias[categoria].activo
    return this.permisos[modulo].categorias[categoria].subcategorias[subcategoria].activo
  }
}
