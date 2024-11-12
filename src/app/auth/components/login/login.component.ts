import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ResultadoAuthLogin } from 'src/app/interfaces/auth';
import { AuthService } from 'src/app/services/auth.service';
import { errorConexionServidor } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

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
    private router: Router
  ) { }

  loginCliente() {
    this.sAuth.loginCliente(this.formLogin.value)
      .subscribe({
        next: (response: ResultadoAuthLogin) => {
          if (response.ok) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/inicio']);
          }          
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }


}
