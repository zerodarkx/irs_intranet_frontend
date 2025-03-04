import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { lastValueFrom } from 'rxjs';

import { Plataforma, CodigoTelefono, PermisoConId, ResultadoUsuario, TipoPerfilUsuario, ITipoDocumento, TipoPropiedad, ErrorHttpCustom } from 'src/app/interfaces';
import { CodigoTelefonoService, PlataformaService, TipoPerfilService, UsuarioService, TipoDocuentosService, TipoPropiedadService } from 'src/app/services';

import { agregarMayusculas, formateadorMiles, formateadorMilesDesdeBase, formatearRut } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { rutValidator, validarPassword } from 'src/app/shared/utils/validadores';

import { PermisosComponent } from '../permisos/permisos.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'mantendor-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  @ViewChild('modalAgregarUsuario') modalAgregarUsuario!: ModalComponent;
  @ViewChild('modalCambiarPassword') modalCambiarPassword!: ModalComponent;
  @ViewChild('modalPermisos') modalPermisos!: ModalComponent;
  @ViewChild('modalInversionista') modalInversionista!: ModalComponent;

  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;
  @ViewChild(PermisosComponent) permisoComponente!: PermisosComponent;

  titulo_cabecera: string = '';
  usuarios: ResultadoUsuario[] = [];
  id_usuario: number = 0;
  nombre_usuario: string = '';
  permisosPorUsuario?: PermisoConId;

  inversionistaForm: FormGroup = this.fb.group({})
  documentosParaVer: ITipoDocumento[] = [];
  propiedadesParaVer: TipoPropiedad[] = [];
  cargaDeFormulario: boolean = false;
  cargaDeDocumento: boolean = false;

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
    private sTipoDocumento: TipoDocuentosService,
    private sTipoPropiedad: TipoPropiedadService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
    this.obtenerSelectCodigoTelefono();
    this.obtenerSelectPlataforma();
    this.obtenerSelectTipoPerfil();
    this.obtenerSelectJefatura();
    this.obtenerTodosLosDocumentos();
    this.obtenerTodoTipoPropiedades();
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

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.inversionistaForm.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  obtenerSelectTipoPerfil() {
    this.sTipoPerfil.obtenerTodosPerfiles()
      .subscribe({
        next: (response) => {
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
        next: (response) => {
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
        next: (response) => {
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
        next: (response) => {
          this.usuarios = response.data;
        },
        error: (error) => {
          errorConexionServidor(error);
        }
      })
  }

  obtenerTodosLosDocumentos() {
    this.sTipoDocumento.obtenerTodosTipoDocumentos()
      .subscribe({
        next: (response) => {
          this.documentosParaVer = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  obtenerTodoTipoPropiedades() {
    this.sTipoPropiedad.obtenerTodasLosTipoPropiedad()
      .subscribe({
        next: (response) => {
          this.propiedadesParaVer = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  modalUsuario(usuario: ResultadoUsuario | null) {

    this.formUsuario.reset();
    this.titulo_cabecera = (!usuario) ? 'Nuevo' : 'Editar';
    const camposRemover = ['usu_password', 'usu_password2'];

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
    this.modalAgregarUsuario.abrirModal()
  }

  modalPassword(usuario: ResultadoUsuario) {
    this.nombre_usuario = usuario.nombreCompleto
    this.id_usuario = usuario.id_usuario;
    this.formPassword.reset();
    this.modalCambiarPassword.abrirModal();
  }

  async toggleEstadoUsuario(usuario: ResultadoUsuario) {
    if (await mostrarConfirmacion('Atención', `estas seguro de modificar estado del Usuario ${usuario.nombreCompleto}`)) {

      let data = {
        id_usuario: usuario.id_usuario,
        estado: usuario.activo
      }

      this.sUsuario.cambiarEstadoUsuario(data)
        .subscribe({
          next: (response) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              usuario.activo = !usuario.activo;
            }
          },
          error: (error: ErrorHttpCustom) => {
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
        next: (response) => {
          mostrarMensaje({
            icono: response.data.icono as IconoSweetAlert,
            mensaje: response.data.mensaje,
            titulo: response.data.titulo
          })

          if (response.ok) {
            this.modalCambiarPassword.cerrarModal();
            this.formPassword.reset();
          }
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  agregarUsuario() {
    if (this.formUsuario.get('id_usuario')?.value) {
      this.sUsuario.editarUsuario(this.formUsuario.value)
        .subscribe({
          next: (response) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalAgregarUsuario.cerrarModal()
              this.obtenerUsuario();
            }
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sUsuario.agregarNuevoUsuario(this.formUsuario.value)
        .subscribe({
          next: (response) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalAgregarUsuario.cerrarModal()
              this.obtenerUsuario();
            }
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }

  abrirmodalPermisos(usuario: ResultadoUsuario) {
    this.nombre_usuario = usuario.nombreCompleto
    this.permisosPorUsuario = {
      id: usuario.id_usuario,
      permisos: usuario.permisos
    };
    this.modalPermisos.abrirModal();
  }

  guardarPermisos() {
    this.sUsuario.guardarPermisosUsuario(this.permisoComponente.permisosForm.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Warning,
            titulo: response.ok ? "Exito" : "Atencion",
            mensaje: response.data.mensaje
          });
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
    const usuario = this.usuarios.find((u) => u.id_usuario === this.permisoComponente.permisosForm.get('id')?.value);
    usuario!.permisos = this.permisoComponente.permisosForm.get('modulos')?.value;
    this.modalPermisos.cerrarModal();
  }

  async abrirInversionista(usuario: ResultadoUsuario): Promise<void> {
    this.nombre_usuario = usuario.nombreCompleto
    const response = await lastValueFrom(this.sUsuario.obtenerDataInversionista(usuario.id_usuario));
    this.inversionistaForm = this.fb.group({
      id_usuario: usuario.id_usuario,
      uf_desde: [formateadorMilesDesdeBase(response.data.monto_invertir_desde), Validators.required],
      uf_hasta: [formateadorMilesDesdeBase(response.data.monto_invertir_hasta), Validators.required],
      ltv_desde: [formateadorMilesDesdeBase(response.data.ltv_desde), Validators.required],
      ltv_hasta: [formateadorMilesDesdeBase(response.data.ltv_hasta), Validators.required],
      plazo_desde: [formateadorMilesDesdeBase(response.data.plazo_desde), Validators.required],
      plazo_hasta: [formateadorMilesDesdeBase(response.data.plazo_hasta), Validators.required],
      tir: [formateadorMilesDesdeBase(response.data.tir), Validators.required],
      verDocumentos: this.fb.array(
        this.documentosParaVer.map((ele) => this.fb.control(response.data.documentos.includes(ele.id_tipoDocumento)))
      ),
      verPropiedades: this.fb.array(
        this.propiedadesParaVer.map((ele) => this.fb.control(response.data.propiedades.includes(ele.id_tipoPropiedad)))
      ),
    });

    this.cargaDeFormulario = true;
    this.cargaDeDocumento = true;
    this.modalInversionista.abrirModal();

  }

  guardarDocumentos(): void {
    const documentoSeleccionados = this.inversionistaForm.value.verDocumentos
      .map((checked: boolean, i: number) => (checked ? this.documentosParaVer[i].id_tipoDocumento : null))
      .filter((id: number | null) => id !== null);

    const propiedadesseleccionados = this.inversionistaForm.value.verPropiedades
      .map((checked: boolean, i: number) => (checked ? this.propiedadesParaVer[i].id_tipoPropiedad : null))
      .filter((id: number | null) => id !== null);

    const { verDocumentos, verPropiedades, ...data } = this.inversionistaForm.value;

    data.documentos = documentoSeleccionados;
    data.propiedades = propiedadesseleccionados;

    this.sUsuario.guardarDataInversionista(data)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            titulo: response.ok ? 'Exito' : 'Atencion',
            mensaje: response.data.mensaje
          })
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })

  }
}
