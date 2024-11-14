import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ResultadoAccionesPerfil, ResultadoObtenerTodosPerfiles, TipoPerfilUsuario } from 'src/app/interfaces/usuarioPerfiles';
import { TipoPerfilService } from 'src/app/services/tipo-perfil.service';
import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  titulo_cabecera: string = '';

  tipoPerfiles: TipoPerfilUsuario[] = []

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

  modalTipoPerfil(tipoPerfil: TipoPerfilUsuario | null) {
    this.formTipoPerfil.reset();
    this.titulo_cabecera = (!tipoPerfil) ? 'Nuevo' : 'Editar';
    if (tipoPerfil) {
      this.formTipoPerfil.patchValue({
        id_tipoUsuario: tipoPerfil.id_tipoUsuario,
        nombre_tipoUsuario: tipoPerfil.nombre_tipoUsuario,
      })
    }
    abrirModal('modalTipoPerfil')
  }

  obtenerTodosPerfil() {
    this.sTipoPerfil.obtenerTodosPerfiles()
      .subscribe({
        next: (response: ResultadoObtenerTodosPerfiles) => {
          this.tipoPerfiles = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  accionTipoPerfil() {
    if (this.formTipoPerfil.get('id_tipoUsuario')?.value) {
      this.sTipoPerfil.editarTipoPerfil(this.formTipoPerfil.value)
        .subscribe({
          next: (response: ResultadoAccionesPerfil) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerTodosPerfil();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sTipoPerfil.agregarTipoPerfil(this.formTipoPerfil.value)
        .subscribe({
          next: (response: ResultadoAccionesPerfil) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerTodosPerfil();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }

}
