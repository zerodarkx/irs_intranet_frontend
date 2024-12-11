import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-recuperar-contrasena',
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
        error: (error: any) => {
          this.mensajeError = 'Favor avisar a un administrador'
        }
      })
  }
}
