import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dataPreviaProrroga, ObtenerProrroga } from 'src/app/interfaces';

import { SalidasService } from 'src/app/services';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

import { dejarNumeroBrutos, formateadorMiles, formateadorMilesDesdeBase } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-prorroga',
  templateUrl: './prorroga.component.html',
  styleUrls: ['./prorroga.component.css']
})
export class ProrrogaComponent {
  @ViewChild('modalProrrogaEditar') modalProrrogaEditar!: ModalComponent;

  formProrroga: FormGroup = this.fb.group({
    pagada: [, Validators.required],
    cantidad_meses: [, Validators.required],
    abono: [, Validators.required],
    porcentaje: [, Validators.required],
    monto_contrato: [, Validators.required],
    monto_contrato_ant: [],
    fecha_vencimiento: [, Validators.required],
  });

  formProrrogaEditar: FormGroup = this.fb.group({
    id_prorroga: [],
    pagada: [, Validators.required],
    cantidad_meses: [, Validators.required],
    abono: [, Validators.required],
    porcentaje: [, Validators.required],
    monto_contrato: [, Validators.required],
    monto_contrato_ant: [],
    fecha_vencimiento: [, Validators.required],
  });

  prorrogas: ObtenerProrroga[] = [];

  data_previo: dataPreviaProrroga = {
    fecha_contrato: new Date,
    valor_contrato: 0,
    valor_contrato_ant: 0
  }

  data_previo_editar: dataPreviaProrroga = {
    fecha_contrato: new Date,
    valor_contrato: 0,
    valor_contrato_ant: 0
  }

  constructor(
    private fb: FormBuilder,
    private sSalidas: SalidasService
  ) { }

  ngOnInit() {
    this.obtenerDataCliente();
  }

  formateadorMiles(event: Event, form: FormGroup) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    form.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  obtenerDataCliente() {

    this.sSalidas.obtenerProrrogaPorCliente()
      .subscribe({
        next: (response) => {
          this.prorrogas = response.data;

          if (!this.prorrogas.length) {
            this.obtenerDataClienteDetalle();
          } else {
            this.data_previo.valor_contrato = this.prorrogas[0].monto_contrato;
            this.data_previo.valor_contrato_ant = this.prorrogas[0].monto_contrato_ant;
            this.data_previo.fecha_contrato = this.prorrogas[0].fecha_vencimiento;
            this.formProrroga.patchValue({ monto_contrato_ant: this.data_previo.valor_contrato })
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      });
  }

  obtenerDataClienteDetalle() {
    return this.sSalidas.obtenerClienteSalidaDetalle()
      .subscribe({
        next: (response) => {
          this.data_previo.valor_contrato = response.data.valor_contrato;
          this.data_previo.valor_contrato_ant = response.data.valor_contrato;
          this.data_previo.fecha_contrato = response.data.fecha_termino;
          this.formProrroga.patchValue({ monto_contrato_ant: this.data_previo.valor_contrato_ant })
        },
        error: (error) => {
          errorConexionServidor(error)
        }
      })
  }

  calcularNuevoVencimiento(tipo?: number) {
    let formulario = !tipo ? this.formProrroga : this.formProrrogaEditar;
    let meses = formulario.value.cantidad_meses;

    if (!meses) {
      formulario.patchValue({ fecha_vencimiento: null })
      return
    }

    let fecha = !tipo ? new Date(this.data_previo.fecha_contrato) : new Date(this.data_previo_editar.fecha_contrato);
    fecha.setMonth(fecha.getMonth() + Number(meses));
    formulario.patchValue({
      fecha_vencimiento: fecha.toISOString().split('T')[0]
    });
  }

  calcularNuevoMontoContrato(tipo?: number) {

    let formulario = !tipo ? this.formProrroga : this.formProrrogaEditar;
    let valorContratoInicial = !tipo ? this.data_previo.valor_contrato : this.data_previo_editar.valor_contrato;

    const porcentaje = dejarNumeroBrutos(formulario.value.porcentaje);
    const descuento = (valorContratoInicial * (Number(porcentaje) / 100));
    const nuevoValor = valorContratoInicial - descuento;
    formulario.patchValue({ monto_contrato: formateadorMilesDesdeBase(nuevoValor) });
  }

  agregarProrroga() {
    this.sSalidas.agregarProrrogaPorCliente(this.formProrroga.value)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.formProrroga.reset();
            this.obtenerDataCliente();
          }

          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: "Atencion",
            mensaje: response.mensaje
          })

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  editarModalProrroga(prorroga: ObtenerProrroga, index: number) {
    try {
      this.data_previo_editar = {
        fecha_contrato: this.prorrogas[index + 1].fecha_vencimiento,
        valor_contrato: this.prorrogas[index + 1].monto_contrato,
        valor_contrato_ant: this.prorrogas[index + 1].monto_contrato_ant,
      }
    } catch (error) {
      this.data_previo_editar = this.data_previo
    }

    this.formProrrogaEditar.patchValue({
      ...prorroga,
      monto_contrato: formateadorMilesDesdeBase(prorroga.monto_contrato)
    })
    this.modalProrrogaEditar.abrirModal();
  }

  editarProrroga() {
    this.sSalidas.modificarProrrogaPorCliente(this.formProrrogaEditar.value)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.obtenerDataCliente();
            this.modalProrrogaEditar.cerrarModal();
          }

          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: "Atencion",
            mensaje: response.mensaje
          })

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

  async eliminarProrroga(id_prorroga: number) {
    if (await mostrarConfirmacion('Estas seguro de eliminar', 'se eliminara la prorroga')) {
      this.sSalidas.eliminarProrrogaPorCliente(id_prorroga)
        .subscribe({
          next: (response) => {
            if (response.ok) {
              this.obtenerDataCliente();
            }
            mostrarMensaje({
              icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
              titulo: response.ok ? "Exito" : "Atencion",
              mensaje: response.mensaje
            })
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }

}
