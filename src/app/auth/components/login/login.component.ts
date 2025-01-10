import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Payload, ResultadoAuthLogin } from 'src/app/interfaces/auth';
import { PermisosModulo } from 'src/app/interfaces/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { PermisosService } from 'src/app/services/permisos.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  mensajeError: string = '';

  formLogin: FormGroup = this.fb.group({
    usuario: ['', [
      Validators.required,
    ]],
    password: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sAuth: AuthService,
    private router: Router,
    private sPermisos: PermisosService,

  ) { }

  loginCliente() {
    this.sAuth.loginCliente(this.formLogin.value)
      .subscribe({
        next: (response: ResultadoAuthLogin) => {
          if (response.ok) {
            try {
              localStorage.setItem('token', response.token);
              const decodedToken = jwtDecode<Payload>(response.token);
              const permisos: PermisosModulo[] = decodedToken.permisos
              if (!permisos) throw new Error();
              this.sPermisos.guardarPermisos(permisos);
              this.router.navigate(['/inicio']);
            } catch (error) {
              localStorage.removeItem('token');
              this.mensajeError = 'No tiene permisos asignados favor avisar a un administrador';
            }
          }
        },
        error: (error: HttpErrorResponse) => {
          this.mensajeError = 'Usuario o Contraseña invalida';
        }
      })
  }


}
