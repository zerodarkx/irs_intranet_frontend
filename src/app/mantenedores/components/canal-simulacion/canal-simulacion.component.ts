import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { ITipoCanales, ResultadoAccionesCanalSimulacion, ResultadoCanalesSimulacion } from 'src/app/interfaces';
import { TipoSimulacionCanalService } from 'src/app/services';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

import { agregarMayusculas, formateadorMiles, formateadorMilesDesdeBase } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'mantendor-canal-simulacion',
  templateUrl: './canal-simulacion.component.html',
  styleUrls: ['./canal-simulacion.component.css']
})
export class CanalSimulacionComponent implements OnInit {
  @ViewChild('tabla') tabla!: Table;
  @ViewChild('iBuscarTodo') iBuscarTodo!: ElementRef;
  @ViewChild('modalCanalSimulacion') modalCanalSimulacion!: ModalComponent;

  titulo_cabecera: string = '';
  canalSimulaciones: ITipoCanales[] = []

  formCanalSimulacion: FormGroup = this.fb.group({
    id_canal: [0],
    nombre_canal: ['', [
      Validators.required
    ]],
    comision_canal: ['', [
      Validators.required
    ]],
    renta_mensual: ['', [
      Validators.required
    ]],
    det_canalSimulacion: ['']
  })

  constructor(
    private fb: FormBuilder,
    private sSimulacionCanal: TipoSimulacionCanalService
  ) { }
  ngOnInit(): void {
    this.obtenerLineaNegocio();
  }

  mayuscula(event: Event): void {
    const input = (event.target as HTMLInputElement)
    input.value = agregarMayusculas(input.value)
    this.formCanalSimulacion.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formCanalSimulacion.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  clear(table: Table) {
    table.clear();
    this.iBuscarTodo.nativeElement.value = ''
  }

  handleFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.tabla.filterGlobal(inputElement.value, 'contains');
  }

  abrirModalCanalSimulacion(lineaNegocio: ITipoCanales | null) {
    this.formCanalSimulacion.reset();
    this.titulo_cabecera = (!lineaNegocio) ? 'Nuevo' : 'Editar';
    if (lineaNegocio) {
      this.formCanalSimulacion.patchValue({
        id_canal: lineaNegocio.id_canal,
        nombre_canal: lineaNegocio.nombre_canal,
        comision_canal: formateadorMilesDesdeBase(lineaNegocio.comision_canal),
        renta_mensual: formateadorMilesDesdeBase(lineaNegocio.renta_mensual),
        det_canalSimulacion: lineaNegocio.det_canalSimulacion,
      })
    }
    this.modalCanalSimulacion.abrirModal();
  }

  obtenerLineaNegocio() {
    this.sSimulacionCanal.obtenerTodosTipoCanales()
      .subscribe({
        next: (response: ResultadoCanalesSimulacion) => {
          this.canalSimulaciones = response.data
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  accionCanalesSimulacion() {
    if (this.formCanalSimulacion.get('id_lineaNegocio')?.value) {
      this.sSimulacionCanal.editarCanalSimulacion(this.formCanalSimulacion.value)
        .subscribe({
          next: (response: ResultadoAccionesCanalSimulacion) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalCanalSimulacion.cerrarModal();
              this.obtenerLineaNegocio();
            }
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    } else {
      this.sSimulacionCanal.agregarCanalSimulacion(this.formCanalSimulacion.value)
        .subscribe({
          next: (response: ResultadoAccionesCanalSimulacion) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalCanalSimulacion.cerrarModal();
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
