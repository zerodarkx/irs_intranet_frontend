import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ITipoImagen, ResultadoAccionesTipoImagenes, ResultadoTipoImagenes } from 'src/app/interfaces/tipoImagenes';
import { TipoImagenesService } from 'src/app/services/tipo-imagenes.service';
import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
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

  modalTipoImagen(tipoImagen: ITipoImagen | null) {
    this.formTipoImagen.reset();
    this.titulo_cabecera = (!tipoImagen) ? 'Nuevo' : 'Editar';
    if (tipoImagen) {
      this.formTipoImagen.patchValue({
        id_tipoImagen: tipoImagen.id_tipoImagen,
        nombre_tipoImagen: tipoImagen.nombre_tipoImagen
      })
    }
    abrirModal('modalTipoImagen')
  }

  obtenerTodosTipoPropiedad() {
    this.sTipoImagenes.obtenerTodosTipoImagenes()
      .subscribe({
        next: (response: ResultadoTipoImagenes) => {
          this.tipoImagen = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  accionTipoPropiedad() {
    if (this.formTipoImagen.get('id_tipoImagen')?.value) {
      this.sTipoImagenes.editarTipoImagen(this.formTipoImagen.value)
        .subscribe({
          next: (response: ResultadoAccionesTipoImagenes) => {
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
      this.sTipoImagenes.agregarTipoImagen(this.formTipoImagen.value)
        .subscribe({
          next: (response: ResultadoAccionesTipoImagenes) => {
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
