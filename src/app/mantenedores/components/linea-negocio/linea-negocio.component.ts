import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { LineaNegocio, ResultadoAccionesLineaNegocio, ResultadoObtenerTodasLineasNegocio } from 'src/app/interfaces/lineaNegocio';
import { LineaNegocioService } from 'src/app/services/linea-negocio.service';
import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { agregarMayusculas } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-linea-negocio',
  templateUrl: './linea-negocio.component.html',
  styleUrls: ['./linea-negocio.component.css']
})
export class LineaNegocioComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;

  titulo_cabecera: string = '';
  lineaNegocios: LineaNegocio[] = []

  formLineaNegocio: FormGroup = this.fb.group({
    id_lineaNegocio: [0],
    nombre_lineaNegocio: ['', [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sLineaNegocio: LineaNegocioService
  ) { }
  ngOnInit(): void {
    this.obtenerLineaNegocio();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formLineaNegocio.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  modalLineaNegocio(lineaNegocio: LineaNegocio | null) {
    this.formLineaNegocio.reset();
    this.titulo_cabecera = (!lineaNegocio) ? 'Nuevo' : 'Editar';
    if (lineaNegocio) {
      this.formLineaNegocio.patchValue({
        id_lineaNegocio: lineaNegocio.id_lineaNegocio,
        nombre_lineaNegocio: lineaNegocio.nombre_lineaNegocio
      })
    }
    abrirModal('modalLineaNegocio')
  }

  obtenerLineaNegocio() {
    this.sLineaNegocio.obtenerTodasLasLineasNegocio()
      .subscribe({
        next: (response: ResultadoObtenerTodasLineasNegocio) => {
          this.lineaNegocios = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  accionLineaNegocio() {
    if (this.formLineaNegocio.get('id_lineaNegocio')?.value) {
      this.sLineaNegocio.editarLineaNegocio(this.formLineaNegocio.value)
        .subscribe({
          next: (response: ResultadoAccionesLineaNegocio) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerLineaNegocio();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sLineaNegocio.agregarLineaNegocio(this.formLineaNegocio.value)
        .subscribe({
          next: (response: ResultadoAccionesLineaNegocio) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              cerrarModal();
              this.obtenerLineaNegocio();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }
}
