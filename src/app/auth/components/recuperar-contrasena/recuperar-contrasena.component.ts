import { Component } from '@angular/core';
import { ErrorHttpCustom } from 'src/app/interfaces';

import { AuthService } from 'src/app/services';

@Component({
  selector: 'auth-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css']
})
export class RecuperarContrasenaComponent {

  correoRecuperar: string = '';
  mensajeError: string = '';

  constructor(
    private sAuth: AuthService
  ) { }

  recuperarPassword() {
    this.sAuth.recuperarPassword(this.correoRecuperar)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          
          if (response.ok) {
            this.mensajeError = response.data.message;
            return;
          }
          this.mensajeError = response.data.message;
        },
        error: (error: ErrorHttpCustom) => {
          this.mensajeError = 'Favor avisar a un administrador'
        }
      })
  }
}
