import { Component } from '@angular/core';
import { Dropdown, Offcanvas } from 'bootstrap';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'shared-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  offcanvasInstance!: Offcanvas;
  dropdownInstance!: Dropdown;

  constructor(
    private sAuth: AuthService
  ) { }


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
