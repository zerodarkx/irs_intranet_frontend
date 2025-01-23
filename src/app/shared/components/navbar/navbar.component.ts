import { Component, OnInit } from '@angular/core';
import { Dropdown, Offcanvas } from 'bootstrap';

import { AuthService, PermisosService } from 'src/app/services';

@Component({
  selector: 'shared-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  offcanvasInstance!: Offcanvas;
  dropdownInstance!: Dropdown;

  permisos!: Record<string, any>;

  constructor(
    private sAuth: AuthService,
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
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

  toggleDropdown(id: string) {
    const dropdownElement = document.getElementById(id);
    if (dropdownElement) {
      this.dropdownInstance = new Dropdown(dropdownElement);
    }
    this.dropdownInstance.toggle();
  }

  toggleOffcanvas() {
    const offcanvasElement = document.getElementById('menuDelNavegador');
    if (offcanvasElement) {
      this.offcanvasInstance = new Offcanvas(offcanvasElement);
    }
    this.offcanvasInstance.toggle();
  }

  cerrarSession() {
    this.sAuth.cerrarSession();
  }
}
