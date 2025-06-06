import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { ErrorHttpCustom, ITipoImagen } from 'src/app/interfaces';
import { TipoImagenesService } from 'src/app/services';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-tipo-imagenes',
  templateUrl: './tipo-imagenes.component.html',
  styleUrls: ['./tipo-imagenes.component.css']
})
export class TipoImagenesComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;
  @ViewChild('modalTipoImagen') modalTipoImagen!: ModalComponent;

  titulo_cabecera: string = '';
  tipoImagen: ITipoImagen[] = []

  formTipoImagen: FormGroup = this.fb.group({
    id_tipoImagen: [0],
    nombre_tipoImagen: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sTipoImagenes: TipoImagenesService
  ) { }
  ngOnInit(): void {
    this.obtenerTodosTipoPropiedad();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formTipoImagen.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  AbrirModalTipoImagen(tipoImagen: ITipoImagen | null) {
    this.formTipoImagen.reset();
    this.titulo_cabecera = (!tipoImagen) ? 'Nuevo' : 'Editar';
    if (tipoImagen) {
      this.formTipoImagen.patchValue({
        id_tipoImagen: tipoImagen.id_tipoImagen,
        nombre_tipoImagen: tipoImagen.nombre_tipoImagen
      })
    }
    this.modalTipoImagen.abrirModal();
  }

  obtenerTodosTipoPropiedad() {
    this.sTipoImagenes.obtenerTodosTipoImagenes()
      .subscribe({
        next: (response) => {
          this.tipoImagen = response.data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  accionTipoPropiedad() {
    if (this.formTipoImagen.get('id_tipoImagen')?.value) {
      this.sTipoImagenes.editarTipoImagen(this.formTipoImagen.value)
        .subscribe({
          next: (response) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalTipoImagen.cerrarModal();
              this.obtenerTodosTipoPropiedad();
            }
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sTipoImagenes.agregarTipoImagen(this.formTipoImagen.value)
        .subscribe({
          next: (response) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalTipoImagen.cerrarModal();
              this.obtenerTodosTipoPropiedad();
            }
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }
}
