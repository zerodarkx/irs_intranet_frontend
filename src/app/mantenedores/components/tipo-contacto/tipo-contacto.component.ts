import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { ResultadoAccionTipoCanalContacto, ResultadoTipoCanalContacto, TipoCanalContacto } from 'src/app/interfaces';
import { TipoContactoService } from 'src/app/services';

import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-tipo-contacto',
  templateUrl: './tipo-contacto.component.html',
  styleUrls: ['./tipo-contacto.component.css']
})
export class TipoContactoComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  titulo_cabecera: string = '';
  tipoCanalContacto: TipoCanalContacto[] = []

  formTipoCanalContacto: FormGroup = this.fb.group({
    id_canal: [0],
    nombre_canal: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sTipoCanalContacto: TipoContactoService
  ) { }
  ngOnInit(): void {
    this.obtenerTodoTipoCanalContacto();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formTipoCanalContacto.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  modalTipoCanalContacto(tipoCanalContacto: TipoCanalContacto | null) {
    this.formTipoCanalContacto.reset();
    this.titulo_cabecera = (!tipoCanalContacto) ? 'Nuevo' : 'Editar';
    if (tipoCanalContacto) {
      this.formTipoCanalContacto.patchValue({
        id_canal: tipoCanalContacto.id_canal,
        nombre_canal: tipoCanalContacto.nombre_canal
      })
    }
    abrirModal('modalTipoCanalContacto')
  }

  async toggleEstadoTipoCanal(canalContacto: TipoCanalContacto) {
    if (await mostrarConfirmacion('Atención', `estas seguro de cambiar el estado del canal ${canalContacto.nombre_canal}`)) {

      this.sTipoCanalContacto.cambiarEstadoCanalContacto(canalContacto)
        .subscribe({
          next: (response: ResultadoAccionTipoCanalContacto) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              canalContacto.estado = !canalContacto.estado;
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }

  obtenerTodoTipoCanalContacto() {
    this.sTipoCanalContacto.obtenerTodosTipoContacto()
      .subscribe({
        next: (response: ResultadoTipoCanalContacto) => {
          this.tipoCanalContacto = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  accionTipoContacto() {
    if (this.formTipoCanalContacto.get('id_canal')?.value) {
      this.sTipoCanalContacto.editarTipoContacto(this.formTipoCanalContacto.value)
        .subscribe({
          next: (response: ResultadoAccionTipoCanalContacto) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerTodoTipoCanalContacto();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sTipoCanalContacto.agregarTipoContacto(this.formTipoCanalContacto.value)
        .subscribe({
          next: (response: ResultadoAccionTipoCanalContacto) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerTodoTipoCanalContacto();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }
}
