import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

import { CodigoTelefono, ErrorHttpCustom, Payload } from 'src/app/interfaces';
import { CodigoTelefonoService, UsuarioService } from 'src/app/services';

import { agregarMayusculas, formatearRut } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { rutValidator, validarPassword } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  selectCodigoTelefono: CodigoTelefono[] = [];

  formUsuario: FormGroup = this.fb.group({
    id_usuario: [0, []],
    id_jefatura: [, []],
    id_codigoTelefonico: [, [
      Validators.required
    ]],
    usu_nombre: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],
    usu_apep: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],
    usu_apem: ['', [
      Validators.required
    ]],
    usu_correo: ['', [
      Validators.required,
      Validators.email,
    ]],
    usu_rut: ['', [
      Validators.required,
      rutValidator
    ]],
    usu_tel: ['', [
      Validators.required
    ]],
  });

  formPassword: FormGroup = this.fb.group({
    id_usuario: [],
    password: ['', Validators.required],
    password2: ['', Validators.required]
  }, {
    validators: validarPassword('password', 'password2')
  });

  constructor(
    private fb: FormBuilder,
    private sUsuario: UsuarioService,
    private sCodigoTelefono: CodigoTelefonoService
  ) { }

  ngOnInit(): void {
    this.obtenerDataUsuario();
    this.obtenerSelectCodigoTelefono();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formUsuario.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  formatearRut(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = formatearRut(input.value)
    this.formUsuario.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  obtenerDataUsuario() {
    const token = localStorage.getItem('token');
    if (token) {
      const { id_usuario } = jwtDecode<Payload>(token);
      this.formPassword.patchValue({ id_usuario });

      this.sUsuario.obtenerDatosUsuarioPorId(id_usuario)
        .subscribe({
          next: (response) => {
            this.formUsuario.patchValue(response.data);
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        });

    }
  }

  obtenerSelectCodigoTelefono() {
    this.sCodigoTelefono.obtenerTodosCodigoTelefono()
      .subscribe({
        next: (response) => {
          this.selectCodigoTelefono = response.data;
        },
        error: (error) => {
          errorConexionServidor(error)
        }
      })
  }

  modificarUsuario() {
    this.sUsuario.editarUsuario(this.formUsuario.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: response.data.mensaje,
            mensaje: response.data.titulo
          })
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

  modificarPassword() {
    this.sUsuario.modificarPassword(this.formPassword.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: response.data.mensaje,
            mensaje: response.data.titulo
          })
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }
}
