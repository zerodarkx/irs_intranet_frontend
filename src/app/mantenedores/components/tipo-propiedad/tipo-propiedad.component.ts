import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { ResultadoAccionesTipoPropiedad, ResultadoObtenerTodosTipoPropiedad, TipoPropiedad } from 'src/app/interfaces/tipoPropiedad';
import { TipoPropiedadService } from 'src/app/services/tipo-propiedad.service';
import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-tipo-propiedad',
  templateUrl: './tipo-propiedad.component.html',
  styleUrls: ['./tipo-propiedad.component.css']
})
export class TipoPropiedadComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  titulo_cabecera: string = '';
  tipoPropiedad: TipoPropiedad[] = []

  formTipoPropiedad: FormGroup = this.fb.group({
    id_tipoPropiedad: [0],
    nombre_tipoPropiedad: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sTipoPropiedad: TipoPropiedadService
  ) { }
  ngOnInit(): void {
    this.obtenerTodosTipoPropiedad();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formTipoPropiedad.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  modalTipoPropiedad(tipoPropiedad: TipoPropiedad | null) {
    this.formTipoPropiedad.reset();
    this.titulo_cabecera = (!tipoPropiedad) ? 'Nuevo' : 'Editar';
    if (tipoPropiedad) {
      this.formTipoPropiedad.patchValue({
        id_tipoPropiedad: tipoPropiedad.id_tipoPropiedad,
        nombre_tipoPropiedad: tipoPropiedad.nombre_tipoPropiedad
      })
    }
    abrirModal('modalTipoPropiedad')
  }

  obtenerTodosTipoPropiedad() {
    this.sTipoPropiedad.obtenerTodasLosTipoPropiedad()
      .subscribe({
        next: (response: ResultadoObtenerTodosTipoPropiedad) => {
          this.tipoPropiedad = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  accionTipoPropiedad() {
    if (this.formTipoPropiedad.get('id_tipoPropiedad')?.value) {
      this.sTipoPropiedad.editarTipoPropiedad(this.formTipoPropiedad.value)
        .subscribe({
          next: (response: ResultadoAccionesTipoPropiedad) => {
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
      this.sTipoPropiedad.agregarTipoPropiedad(this.formTipoPropiedad.value)
        .subscribe({
          next: (response: ResultadoAccionesTipoPropiedad) => {
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
