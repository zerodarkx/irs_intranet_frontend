import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { ErrorHttpCustom, PermisoConId, TipoPerfilUsuario } from 'src/app/interfaces';
import { TipoPerfilService } from 'src/app/services';

import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

import { PermisosComponent } from '../permisos/permisos.component';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

@Component({
  selector: 'mantendor-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;
  @ViewChild(PermisosComponent) permisoComponente!: PermisosComponent;
  @ViewChild('modalTipoPerfil') modalTipoPerfil!: ModalComponent;
  @ViewChild('modalPermisos') modalPermisos!: ModalComponent;

  titulo_cabecera: string = '';

  tipoPerfiles: TipoPerfilUsuario[] = []
  permisosPorPerfil?: PermisoConId;

  formTipoPerfil: FormGroup = this.fb.group({
    id_tipoUsuario: [0],
    nombre_tipoUsuario: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sTipoPerfil: TipoPerfilService
  ) { }
  ngOnInit(): void {
    this.obtenerTodosPerfil();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formTipoPerfil.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  abrirModalTipoPerfil(tipoPerfil: TipoPerfilUsuario | null) {
    this.formTipoPerfil.reset();
    this.titulo_cabecera = (!tipoPerfil) ? 'Nuevo' : 'Editar';
    if (tipoPerfil) {
      this.formTipoPerfil.patchValue({
        id_tipoUsuario: tipoPerfil.id_tipoUsuario,
        nombre_tipoUsuario: tipoPerfil.nombre_tipoUsuario,
      });
    }
    this.modalTipoPerfil.abrirModal();
  }

  obtenerTodosPerfil() {
    this.sTipoPerfil.obtenerTodosPerfiles()
      .subscribe({
        next: (response) => {
          this.tipoPerfiles = response.data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  accionTipoPerfil() {
    if (this.formTipoPerfil.get('id_tipoUsuario')?.value) {
      this.sTipoPerfil.editarTipoPerfil(this.formTipoPerfil.value)
        .subscribe({
          next: (response) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalTipoPerfil.cerrarModal();
              this.obtenerTodosPerfil();
            }
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sTipoPerfil.agregarTipoPerfil(this.formTipoPerfil.value)
        .subscribe({
          next: (response) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalTipoPerfil.cerrarModal();
              this.obtenerTodosPerfil();
            }
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }

  abrirModalPermisos(tipoPerfil: TipoPerfilUsuario) {
    this.permisosPorPerfil = {
      id: tipoPerfil.id_tipoUsuario,
      permisos: tipoPerfil.permisos
    };
    this.modalPermisos.abrirModal();
  }

  guardarPermisos() {
    this.sTipoPerfil.guardarPermisosTipoPerfil(this.permisoComponente.permisosForm.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Warning,
            titulo: response.ok ? "Exito" : "Atencion",
            mensaje: response.data.mensaje
          });
          if (response.ok) {
            this.modalPermisos.cerrarModal();
          }
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
    const perfil = this.tipoPerfiles.find((u) => u.id_tipoUsuario === this.permisoComponente.permisosForm.get('id')?.value);
    perfil!.permisos = this.permisoComponente.permisosForm.get('modulos')?.value;
  }

}
