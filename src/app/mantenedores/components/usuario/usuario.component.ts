import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Plataforma, ResultadoObtenerTodasPlataformas } from 'src/app/interfaces/plataforma';
import { CodigoTelefono, ResultadoObtenerTodosCodigoTelefono } from 'src/app/interfaces/telefonoCodigo';
import { ResultadoAccionesUsuario, ResultadoObtenerTodosUsuario, ResultadoUsuario } from 'src/app/interfaces/usuario';
import { ResultadoObtenerTodosPerfiles, TipoPerfilUsuario } from 'src/app/interfaces/usuarioPerfiles';
import { CodigoTelefonoService } from 'src/app/services/codigo-telefono.service';
import { PlataformaService } from 'src/app/services/plataforma.service';
import { TipoPerfilService } from 'src/app/services/tipo-perfil.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { agregarMayusculas, formatearRut } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { rutValidator, validarPassword } from 'src/app/shared/utils/validadores';

@Component({
  selector: 'mantendor-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  titulo_cabecera: string = '';
  usuarios: ResultadoUsuario[] = [];
  id_usuario: string = '';

  /** SELECTs */
  selectTipoPerfil: TipoPerfilUsuario[] = []
  selectPlataforma: Plataforma[] = []
  selectCodigoTelefono: CodigoTelefono[] = []
  selectJefatura = []

  formUsuario: FormGroup = this.fb.group({
    id_usuario: [0, []],
    id_jefatura: [, []],
    id_codigoTelefonico: [, [
      Validators.required
    ]],
    id_tipoUsuario: [, [
      Validators.required
    ]],
    id_plataforma: [, [
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
    usu_password: ['', [
      Validators.required,
      Validators.minLength(8)
    ]],
    usu_password2: ['', [
      Validators.required,
    ]],
    usu_tel: ['', [
      Validators.required
    ]],
    persmisos: ['', [
      // Validators.required
    ]],
  }, {
    validators: validarPassword('usu_password', 'usu_password2')
  })

  formPassword: FormGroup = this.fb.group({
    password: ['', Validators.required],
    password2: ['', Validators.required]
  }, {
    validators: validarPassword('password', 'password2')
  })

  constructor(
    private fb: FormBuilder,
    private sUsuario: UsuarioService,
    private sPlataforma: PlataformaService,
    private sTipoPerfil: TipoPerfilService,
    private sCodigoTelefono: CodigoTelefonoService,
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerSelectCodigoTelefono();
    this.obtenerSelectPlataforma();
    this.obtenerSelectTipoPerfil();
    this.obtenerSelectJefatura();
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

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  obtenerSelectTipoPerfil() {
    this.sTipoPerfil.obtenerTodosPerfiles()
      .subscribe({
        next: (response: ResultadoObtenerTodosPerfiles) => {
          this.selectTipoPerfil = response.data
        },
        error: (error) => {
          errorConexionServidor(error)
        }
      })
  }

  obtenerSelectPlataforma() {
    this.sPlataforma.obtenerTodasLasPlataformas()
      .subscribe({
        next: (response: ResultadoObtenerTodasPlataformas) => {
          this.selectPlataforma = response.data;
        },
        error: (error) => {
          errorConexionServidor(error)
        }
      })
  }

  obtenerSelectJefatura() {

  }

  obtenerSelectCodigoTelefono() {
    this.sCodigoTelefono.obtenerTodosCodigoTelefono()
      .subscribe({
        next: (response: ResultadoObtenerTodosCodigoTelefono) => {
          this.selectCodigoTelefono = response.data;
        },
        error: (error) => {
          errorConexionServidor(error)
        }
      })
  }

  obtenerUsuario() {
    this.sUsuario.obtenerTodosUsuario()
      .subscribe({
        next: (response: ResultadoObtenerTodosUsuario) => {
          this.usuarios = response.data;
        },
        error: (error) => {
          errorConexionServidor(error);
        }
      })
  }

  modalUsuario(usuario: ResultadoUsuario | null) {
    this.formUsuario.reset();
    this.titulo_cabecera = (!usuario) ? 'Nuevo' : 'Editar';
    const camposRemover = ['usu_password', 'usu_password2']
    if (usuario) {
      this.formUsuario.patchValue({
        id_usuario: usuario.id_usuario,
        id_jefatura: usuario.id_jefatura,
        id_codigoTelefonico: usuario.id_codigoTelefonico,
        id_tipoUsuario: usuario.id_perfil,
        id_plataforma: usuario.id_plataforma,
        usu_nombre: usuario.nom,
        usu_apep: usuario.apep,
        usu_apem: usuario.apem,
        usu_correo: usuario.email,
        usu_rut: usuario.rut,
        usu_tel: usuario.telefono,
        persmisos: 1,
      })

      camposRemover.forEach(campo => {
        const control = this.formUsuario.get(campo);
        control?.clearValidators();
        control?.updateValueAndValidity();
      })
    } else {
      camposRemover.forEach(campo => {
        const control = this.formUsuario.get(campo);
        control?.setValidators([Validators.required, Validators.minLength(8)]);
        control?.updateValueAndValidity();
      })
    }
    abrirModal('modalUsuario')
  }

  modalPassword(id_usuario: string) {
    this.id_usuario = id_usuario;
    this.formPassword.reset();
    abrirModal('modalPassword')
  }

  async toggleEstadoUsuario(usuario: ResultadoUsuario) {
    if (await mostrarConfirmacion('Atención', `estas seguro de modificar estado del Usuario ${usuario.nombreCompleto}`)) {

      let data = {
        id_usuario: usuario.id_usuario,
        estado: usuario.activo
      }

      this.sUsuario.cambiarEstadoUsuario(data)
        .subscribe({
          next: (response: ResultadoAccionesUsuario) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              usuario.activo = !usuario.activo;
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }

  cambiarPassword() {
    
    const data = {
      id_usuario: this.id_usuario,
      password: this.formPassword.get('password')?.value
    }

    this.sUsuario.modificarPassword(data)
      .subscribe({
        next: (response: ResultadoAccionesUsuario) => {
          mostrarMensaje({
            icono: response.data.icono as IconoSweetAlert,
            mensaje: response.data.mensaje,
            titulo: response.data.titulo
          })

          if (response.ok) {
            cerrarModal();
            this.formPassword.reset();
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  agregarUsuario() {
    if (this.formUsuario.get('id_usuario')?.value) {
      this.sUsuario.editarUsuario(this.formUsuario.value)
        .subscribe({
          next: (response: ResultadoAccionesUsuario) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerUsuario();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sUsuario.agregarNuevoUsuario(this.formUsuario.value)
        .subscribe({
          next: (response: ResultadoAccionesUsuario) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerUsuario();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }
}
