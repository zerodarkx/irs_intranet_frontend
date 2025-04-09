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

  toggleDropdown(id: string): void {
    const dropdownElement = document.getElementById(id);
    if (!dropdownElement) return;

    const instance = Dropdown.getOrCreateInstance(dropdownElement);
    instance.toggle();
  }

  toggleOffcanvas(): void {
    const offcanvasElement = document.getElementById('menuDelNavegador');
    if (!offcanvasElement) return;

    const instance = Offcanvas.getOrCreateInstance(offcanvasElement);
    instance.toggle();
  }

  cerrarSession() {
    this.sAuth.cerrarSession();
  }
}
