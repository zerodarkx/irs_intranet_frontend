import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { ITipoDocumento, ResultadoAccionesTipoDocumento, ResultadoTipoDocumentos } from 'src/app/interfaces';
import { TipoDocuentosService } from 'src/app/services';

import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-tipo-documentos',
  templateUrl: './tipo-documentos.component.html',
  styleUrls: ['./tipo-documentos.component.css']
})
export class TipoDocumentosComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  titulo_cabecera: string = '';
  tipoDocumento: ITipoDocumento[] = []

  formTipoDocumento: FormGroup = this.fb.group({
    id_tipoDocumento: [0],
    nombre_tipoDocumento: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sTipoDocumento: TipoDocuentosService
  ) { }
  ngOnInit(): void {
    this.obtenerTodosTipoPropiedad();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formTipoDocumento.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  modalTipoDocumento(tipoDocumento: ITipoDocumento | null) {
    this.formTipoDocumento.reset();
    this.titulo_cabecera = (!tipoDocumento) ? 'Nuevo' : 'Editar';
    if (tipoDocumento) {
      this.formTipoDocumento.patchValue({
        id_tipoDocumento: tipoDocumento.id_tipoDocumento,
        nombre_tipoDocumento: tipoDocumento.nombre_tipoDocumento
      })
    }
    abrirModal('modalTipoDocumento')
  }

  obtenerTodosTipoPropiedad() {
    this.sTipoDocumento.obtenerTodosTipoDocumentos()
      .subscribe({
        next: (response: ResultadoTipoDocumentos) => {
          this.tipoDocumento = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  accionTipoPropiedad() {
    if (this.formTipoDocumento.get('id_tipoDocumento')?.value) {
      this.sTipoDocumento.editarTipoDocumento(this.formTipoDocumento.value)
        .subscribe({
          next: (response: ResultadoAccionesTipoDocumento) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerTodosTipoPropiedad();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sTipoDocumento.agregarTipoDocumento(this.formTipoDocumento.value)
        .subscribe({
          next: (response: ResultadoAccionesTipoDocumento) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerTodosTipoPropiedad();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }
}
