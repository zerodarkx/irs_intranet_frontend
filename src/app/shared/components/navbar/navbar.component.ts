import { Component, OnInit } from '@angular/core';
import { Dropdown, Offcanvas } from 'bootstrap';
import { PermisosModulo } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'shared-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  offcanvasInstance!: Offcanvas;
  dropdownInstance!: Dropdown;

  permisos!: Record<string, any>;

  permisosSubCliente = {
    agregarCliente: false,
    exportarExcel: false
  };

  constructor(
    private sAuth: AuthService,
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
    this.permisos = this.sPermiso.obtenerPermisos();
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
