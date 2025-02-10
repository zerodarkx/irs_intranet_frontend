import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'sahred-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent {

  constructor(private location: Location) { }  // Inyecta el servicio Location

  // Método para regresar a la página anterior
  goBack() {
    this.location.back();  // Vuelve a la ruta anterior en el historial
  }
}
