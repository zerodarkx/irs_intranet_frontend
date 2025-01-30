import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

import { ITipoDocumento, LineaNegocio, ResultadoAccionesLineaNegocio, ResultadoObtenerTodasLineasNegocio } from 'src/app/interfaces';
import { LineaNegocioService, TipoDocuentosService } from 'src/app/services';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

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
  @ViewChild('modalLineaNegocio') modalLineaNegocio!: ModalComponent;

  titulo_cabecera: string = '';
  lineaNegocios: LineaNegocio[] = [];
  documentos: ITipoDocumento[] = [];
  cargaDeDocumento: boolean = false;

  formLineaNegocio: FormGroup = this.fb.group({});

  constructor(
    private fb: FormBuilder,
    private sLineaNegocio: LineaNegocioService,
    private sDocumetos: TipoDocuentosService
  ) { }
  ngOnInit(): void {
    this.obtenerLineaNegocio();
    this.obtenerTodosLosDocuentos();
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

  async abrirModalLineaNegocio(lineaNegocio: LineaNegocio | null) {
    this.formLineaNegocio.reset();
    this.titulo_cabecera = (!lineaNegocio) ? 'Nuevo' : 'Editar';
    if (lineaNegocio) {
      console.log(lineaNegocio.documentos);

      this.formLineaNegocio = this.fb.group({
        id_lineaNegocio: [lineaNegocio.id_lineaNegocio],
        nombre_lineaNegocio: [lineaNegocio.nombre_lineaNegocio, [
          Validators.required
        ]],
        documentos: this.fb.array(
          this.documentos.map((ele) => this.fb.control(lineaNegocio.documentos.includes(ele.id_tipoDocumento)))
        )
      });
      this.cargaDeDocumento = true;
    }
    this.modalLineaNegocio.abrirModal();
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

  obtenerTodosLosDocuentos() {
    this.sDocumetos.obtenerTodosTipoDocumentos()
      .subscribe({
        next: (response) => {
          this.documentos = response.data;
          this.formLineaNegocio = this.fb.group({
            id_lineaNegocio: [0],
            nombre_lineaNegocio: ['', [
              Validators.required
            ]],
            documentos: this.fb.array(
              this.documentos.map((ele) => { return this.fb.control(ele.id_tipoDocumento) })
            )
          });
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  accionLineaNegocio() {
    if (this.formLineaNegocio.get('id_lineaNegocio')?.value) {
      this.formLineaNegocio.value.documentos = this.formLineaNegocio.value.documentos
        .map((checked: boolean, i: number) => (checked ? this.documentos[i].id_tipoDocumento : null))
        .filter((id: number | null) => id !== null);

      this.sLineaNegocio.editarLineaNegocio(this.formLineaNegocio.value)
        .subscribe({
          next: (response: ResultadoAccionesLineaNegocio) => {
            mostrarMensaje({
              icono: response.data.icono as IconoSweetAlert,
              mensaje: response.data.mensaje,
              titulo: response.data.titulo
            })

            if (response.ok) {
              this.modalLineaNegocio.cerrarModal();
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
              this.modalLineaNegocio.cerrarModal();
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
