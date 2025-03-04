import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

import { ErrorHttpCustom, TodasBitacoras } from 'src/app/interfaces';
import { SalidasService } from 'src/app/services';

import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.css']
})
export class BitacoraComponent implements OnInit {
  @ViewChild('modalBitacoraEditar') modalBitacoraEditar!: ModalComponent;

  comentariosBitacoraDetalle!: TodasBitacoras;
  comentariosBitacora: TodasBitacoras[] = [];

  formBitacora: FormGroup = this.fb.group({
    id_bitacora: [0],
    comentario: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
  });

  formBitacoraEditar: FormGroup = this.fb.group({
    id_bitacora: [],
    comentario: [, [
      Validators.required,
      Validators.minLength(6)
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sSalidas: SalidasService
  ) { }

  ngOnInit(): void {
    this.obtenerComentarios();
  }

  obtenerComentarios() {
    this.sSalidas.obtenerBitacorasPorCliente()
      .subscribe({
        next: (response) => {
          this.comentariosBitacora = response.data;
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      })
  }

  guardarBitacora() {
    this.sSalidas.crearBitacoraPorCliente(this.formBitacora.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            mensaje: response.mensaje,
            titulo: response.ok ? "Exito" : "Atencion"
          });
          this.obtenerComentarios();
          this.formBitacora.reset();
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      })
  }

  editarModalBitacora(bitacora: TodasBitacoras) {
    this.comentariosBitacoraDetalle = bitacora;
    this.formBitacoraEditar.patchValue(bitacora);
    this.modalBitacoraEditar.abrirModal();
  }

  editarBitacora() {
    this.sSalidas.editarBitacoraPorCliente(this.formBitacoraEditar.value)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.modalBitacoraEditar.cerrarModal();
            this.obtenerComentarios();
          }
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            titulo: response.ok ? "Exito" : "Atencion",
            mensaje: response.mensaje
          })
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        }
      })

  }

  async eliminarBitacora(id_bitacora: number) {
    if (await mostrarConfirmacion('Estas seguro de eliminar', 'se eliminara la bitacora')) {
      this.sSalidas.eliminarBitacoraPorCliente(id_bitacora)
        .subscribe({
          next: (response) => {
            if (response.ok) {
              this.obtenerComentarios();
            }
            mostrarMensaje({
              icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
              titulo: response.ok ? "Exito" : "Atencion",
              mensaje: response.mensaje
            })
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }

}
