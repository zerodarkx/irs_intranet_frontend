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

  constructor(
    private sAuth: AuthService,
    private router: Router
  ) { }

  recuperarPassword() {
    this.sAuth.recuperarPassword(this.correoRecuperar)
      .subscribe({
        next: (response: any) => {
          if (response.ok) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/inicio']);
          }
        },
        error: (error: any) => {
          errorConexionServidor(error);
        }
      })
  }
}
