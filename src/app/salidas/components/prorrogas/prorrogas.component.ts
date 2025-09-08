import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin, of, switchMap } from 'rxjs';
import { ErrorHttpCustom, Prorroga } from 'src/app/interfaces';

import { SalidasService, ValorUfService } from 'src/app/services';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';
import {
  dejarNumeroBrutos,
  formateadorMiles,
  formateadorMilesSinDecimal,
  formatearNumeroBrutosAMiles,
} from 'src/app/shared/utils/formateadores';
import {
  errorConexionServidor,
  IconoSweetAlert,
  mostrarConfirmacion,
  mostrarMensaje,
} from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-prorrogas',
  templateUrl: './prorrogas.component.html',
  styleUrls: ['./prorrogas.component.css'],
})
export class ProrrogasComponent {
  @ViewChild('modalProrrogaAgregarEditar')
  modalProrrogaAgregarEditar!: ModalComponent;
  @ViewChild('modalProrrogaVizualizar')
  modalProrrogaVizualizar!: ModalComponent;

  id_cliente: string | null = '';
  id_prorroga_imprimir: number = 0;
  prorrogas: Prorroga[] = [];
  valorUfHoy: number = 0;
  valorUfFechaEspecifica: number = 0;
  calcularSimulacionEstado: boolean = false;
  simulacionPendiente: boolean = false;

  ultimaProrroga: Prorroga | null = null;

  detalleProrroga = {
    valorMinimo: 0,
    opcionRecompra: 0,
    comisionProrroga: 0,
    contribucionesProrroga: 0,
    seguroProrroga: 0,
    arriendoProrroga: 0,
    gastosOperacionales: 0,
    gastosLegales: 0,
    total: 0,
    mesesProrroga: 0,
    fechaInicial: '',
    fechaProrrogaNueva: '',
  };

  formAgregarProrroga: FormGroup = this.fb.group({
    id_prorroga: [],

    fechaCurseActual: [],
    fechaVencimientoActual: [],

    saldoCapital: [],
    abonoCapital: [, Validators.required],
    saldoCapitalActualizado: [],
    mesesProrroga: [, Validators.required],
    fechaNuevaVencimiento: [],
    valorUfHoy: [],

    comisionEnPesos: [, Validators.required],
    comisionEnPorcentaje: [, Validators.required],

    seguroValorAnual: [, Validators.required],
    seguroCantidadMeses: [, Validators.required],
    seguroValorMensual: [],

    contribucinesValorAnual: [, Validators.required],
    contribucionesCantidadMeses: [, Validators.required],
    contribucionesValorMensual: [],

    rentasValorEnPesos: [, Validators.required],
    fechaFirmaCurse: [],
    valorUfFechaCurse: [],
    // crear los campos nuevos del html para el formulario
    valorRentaCurse: [],
    valorTasaContrato: [],
    valorTasaCliente: [, Validators.required],
    sobretasaMensual: [],
    sobretasaProrroga: [],

    gastosOperacionales: [27, Validators.required],
    gastosLegales: [0, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private sSalidas: SalidasService,
    private sValorUf: ValorUfService
  ) {
    this.obtenerValorUfHoy();
    this.obtenerProrrogas();
  }

  obtenerDataCliente() {
    this.sSalidas.obtenerProrrogaPorCliente().subscribe({
      next: (response) => {
        this.prorrogas = response.data;

        // cuando es por primera vez la prorroga
        if (!this.prorrogas.length) {
          this.obtenerDetalleClienteSalida();
        } else {
          let obtenerUltimaProrroga = this.prorrogas.find(
            (prorroga) => prorroga.estado
          );
          if (obtenerUltimaProrroga) {
            this.id_cliente = obtenerUltimaProrroga.id_cliente.toString();
            this.formAgregarProrroga.patchValue({
              fechaCurseActual: obtenerUltimaProrroga.fechaCurseActual,
              fechaVencimientoActual:
                obtenerUltimaProrroga.fechaNuevaVencimiento,
              saldoCapital: formatearNumeroBrutosAMiles(
                obtenerUltimaProrroga.saldoCapitalActualizado
              ),
              valorUfHoy: formatearNumeroBrutosAMiles(this.valorUfHoy),
              valorUfFechaCurse: formatearNumeroBrutosAMiles(
                obtenerUltimaProrroga.valorUfHoy
              ),
              fechaFirmaCurse: obtenerUltimaProrroga.fechaIngreso,
            });
          } else {
            this.simulacionPendiente = false;
          }
        }
      },
      error: (error: ErrorHttpCustom) => {
        errorConexionServidor(error);
      },
    });
  }

  //obtener data del cliente como segunda intancia en caso de no haber datos en la tabla de las prorrogas
  obtenerDetalleClienteSalida() {
    this.sSalidas
      .obtenerClienteSalidaDetalle()
      .pipe(
        switchMap((response) => {
          const fecha = response.data.fecha_cursado_inicio;

          return forkJoin({
            detalle: of(response),
            ufFecha: this.sValorUf.obtenerValorUfFechaEspecifica(
              fecha.toString()
            ),
          });
        })
      )
      .subscribe({
        next: ({ detalle, ufFecha }) => {
          this.valorUfFechaEspecifica = ufFecha.data.Valor;
          this.id_cliente = detalle.data.id_cliente.toString();

          // Patch completo del formulario
          this.formAgregarProrroga.patchValue({
            fechaCurseActual: detalle.data.fecha_cursado_inicio,
            fechaVencimientoActual: detalle.data.fecha_cursado_termino,
            saldoCapital: formatearNumeroBrutosAMiles(
              detalle.data.valor_contrato
            ),
            valorUfHoy: formatearNumeroBrutosAMiles(this.valorUfHoy),
            valorUfFechaCurse: formatearNumeroBrutosAMiles(
              this.valorUfFechaEspecifica
            ),
            fechaFirmaCurse: detalle.data.fecha_cursado_inicio,
          });
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        },
      });
  }

  // listado para traer todas las progrrogas
  obtenerProrrogas() {
    this.sSalidas.obtenerProrrogaPorCliente().subscribe({
      next: (response) => {
        this.prorrogas = response.data;
        // cuando ya existe una prorroga
        let prrorogaPendiente = this.prorrogas.some(
          (prorroga) => !prorroga.estado
        );
        if (prrorogaPendiente) {
          this.simulacionPendiente = true;
        }
      },
      error: (error: ErrorHttpCustom) => {
        errorConexionServidor(error);
      },
    });
  }

  obtenerValorUfHoy() {
    this.sValorUf.obtenerValorUfHoy().subscribe({
      next: (resp) => {
        this.valorUfHoy = resp.data.Valor;
        // this.obtenerProrrogas();
      },
      error: (err) => {
        console.error('Error al obtener el valor de la UF:', err);
      },
    });
  }

  formateadorMiles(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = formateadorMiles(input.value);
    this.formAgregarProrroga
      .get(input.getAttribute('formControlName')!)
      ?.setValue(input.value);
  }

  // calcula nueva fecha de vencimiento
  calcularNuevoVencimiento(tipo?: number) {
    let formulario = this.formAgregarProrroga; //!tipo ? this.formProrroga : this.formProrrogaEditar;
    let meses = formulario.value.mesesProrroga;

    if (!meses) {
      formulario.patchValue({ fechaNuevaVencimiento: null });
      return;
    }

    let fecha = new Date(formulario.value.fechaVencimientoActual); //!tipo ? new Date(this.data_previo.fecha_contrato) : new Date(this.data_previo_editar.fecha_contrato);
    fecha.setMonth(fecha.getMonth() + Number(meses));
    formulario.patchValue({
      fechaNuevaVencimiento: fecha.toISOString().split('T')[0],
    });
  }

  // calcular nuevo saldo capital actualizado
  calcularSaldoCapitarActualizado() {
    let formulario = this.formAgregarProrroga;
    let saldoCapital = formulario.value.saldoCapital
      ? Number(dejarNumeroBrutos(formulario.value.saldoCapital))
      : 0;
    let abonoCapital = formulario.value.abonoCapital
      ? Number(dejarNumeroBrutos(formulario.value.abonoCapital))
      : 0;

    let calcularPorcentaje = (abonoCapital / 100) * saldoCapital;
    let nuevoSaldo = saldoCapital - calcularPorcentaje;

    formulario.patchValue({
      saldoCapitalActualizado: formatearNumeroBrutosAMiles(nuevoSaldo),
    });
  }

  // calcula el porcentaje de la comision de la prorroga
  calcularPorcentajeComisionProrroga() {
    let formulario = this.formAgregarProrroga;
    let saldoCapitalActualizado = formulario.value.saldoCapitalActualizado
      ? Number(dejarNumeroBrutos(formulario.value.saldoCapitalActualizado))
      : 0;
    let comisionEnPesos = formulario.value.comisionEnPesos
      ? Number(dejarNumeroBrutos(formulario.value.comisionEnPesos))
      : 0;

    if (!comisionEnPesos || !saldoCapitalActualizado || !this.valorUfHoy) {
      return formulario.patchValue({ comisionEnPorcentaje: 0 });
    }

    let resultado =
      (comisionEnPesos / this.valorUfHoy / saldoCapitalActualizado) * 100;

    formulario.patchValue({
      comisionEnPorcentaje: formatearNumeroBrutosAMiles(resultado.toFixed(2)),
    });
  }

  // calcula el valor mensual del seguro
  calcularValorSeguro() {
    let formulario = this.formAgregarProrroga;
    let valorAnual = formulario.value.seguroValorAnual
      ? Number(dejarNumeroBrutos(formulario.value.seguroValorAnual))
      : 0;
    let cantidadMeses = formulario.value.seguroCantidadMeses
      ? Number(dejarNumeroBrutos(formulario.value.seguroCantidadMeses))
      : 0;

    if (!valorAnual || !cantidadMeses) {
      return formulario.patchValue({ seguroValorMensual: 0 });
    }

    let resultado = (valorAnual / 12) * cantidadMeses;

    formulario.patchValue({
      seguroValorMensual: formatearNumeroBrutosAMiles(resultado.toFixed(2)),
    });
  }

  // calcula el valor mensual de las contribuciones
  calcularValorContribucion() {
    let formulario = this.formAgregarProrroga;
    let valorAnual = formulario.value.contribucinesValorAnual
      ? Number(dejarNumeroBrutos(formulario.value.contribucinesValorAnual))
      : 0;
    let cantidadMeses = formulario.value.contribucionesCantidadMeses
      ? Number(dejarNumeroBrutos(formulario.value.contribucionesCantidadMeses))
      : 0;

    if (!valorAnual || !cantidadMeses) {
      return formulario.patchValue({ contribucionesValorMensual: 0 });
    }

    let resultado = (valorAnual / this.valorUfHoy) * cantidadMeses;

    formulario.patchValue({
      contribucionesValorMensual: formatearNumeroBrutosAMiles(resultado),
    });
  }

  // calcula las tasas y valores relacionados
  calcularTasas() {
    let formulario = this.formAgregarProrroga;

    if (
      !formulario.value.rentasValorEnPesos ||
      !formulario.value.valorTasaCliente
    )
      return;

    let valorEnPesos = this.formatearNumero(
      formulario.value.rentasValorEnPesos
    );
    let valorTasaCliente = Number(
      dejarNumeroBrutos(formulario.value.valorTasaCliente)
    );

    if (!valorEnPesos || !valorTasaCliente) return;

    let valorRentaBruto =
      valorEnPesos / this.formatearNumero(formulario.value.valorUfFechaCurse);
    let valorTasaContrato =
      (valorRentaBruto / this.formatearNumero(formulario.value.saldoCapital)) *
      100;
    let sobreTasa = valorTasaCliente - valorTasaContrato;
    let sobreTasaProrroga = sobreTasa * formulario.value.mesesProrroga;

    formulario.patchValue({
      valorRentaCurse: formatearNumeroBrutosAMiles(valorRentaBruto),
      valorTasaContrato: formatearNumeroBrutosAMiles(valorTasaContrato),
      sobretasaMensual: formatearNumeroBrutosAMiles(sobreTasa),
      sobretasaProrroga: formatearNumeroBrutosAMiles(sobreTasaProrroga),
    });
  }

  // calcular el total de la prorroga
  calcularSimulacionFinal() {
    console.log('entre aqui');
    this.calcularSimulacionEstado = true;

    let formulario = this.formAgregarProrroga.value;

    this.detalleProrroga = {
      valorMinimo: this.formatearNumero(formulario.saldoCapital) / 0.97,
      opcionRecompra: this.formatearNumero(formulario.saldoCapitalActualizado),
      comisionProrroga:
        (this.formatearNumero(formulario.comisionEnPorcentaje) / 100) *
        this.formatearNumero(formulario.saldoCapitalActualizado),
      contribucionesProrroga: this.formatearNumero(
        formulario.contribucionesValorMensual
      ),
      seguroProrroga: this.formatearNumero(formulario.seguroValorMensual),
      arriendoProrroga:
        this.formatearNumero(formulario.saldoCapitalActualizado) *
        Number(formulario.mesesProrroga) *
        (this.formatearNumero(formulario.valorTasaCliente) / 100),
      gastosOperacionales: this.formatearNumero(formulario.gastosOperacionales),
      gastosLegales: this.formatearNumero(formulario.gastosLegales),
      total: 0,
      fechaInicial: formulario.fechaVencimientoActual,
      fechaProrrogaNueva: formulario.fechaNuevaVencimiento,
      mesesProrroga: formulario.mesesProrroga,
    };

    // total sumar el abono + todo lo otro
    this.detalleProrroga = {
      ...this.detalleProrroga,
      total:
        this.detalleProrroga.comisionProrroga +
        this.detalleProrroga.contribucionesProrroga +
        this.detalleProrroga.seguroProrroga +
        this.detalleProrroga.arriendoProrroga +
        this.detalleProrroga.gastosOperacionales +
        this.detalleProrroga.gastosLegales +
        this.formatearNumero(formulario.saldoCapital) /
          this.formatearNumero(formulario.saldoCapitalActualizado),
    };
  }

  formatearNumero(valor: any) {
    return Number(dejarNumeroBrutos(valor));
  }

  modalAgregarProrroga() {
    this.obtenerDataCliente();
    this.modalProrrogaAgregarEditar.abrirModal();
  }

  agregarNuevaProrroga() {
    this.sSalidas
      .agregarProrrogaPorCliente(this.formAgregarProrroga.value)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'Exito',
              mensaje: response.mensaje,
            });
            this.modalProrrogaAgregarEditar.cerrarModal();
            this.obtenerDataCliente();
            return;
          }
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        },
      });
  }

  modalEditarProrroga(prorroga: Prorroga) {
    this.formAgregarProrroga.patchValue({
      id_prorroga: prorroga.id_prorroga,
      fechaCurseActual: prorroga.fechaCurseActual,
      fechaVencimientoActual: prorroga.fechaVencimientoActual,
      saldoCapital: formatearNumeroBrutosAMiles(prorroga.saldoCapital),
      abonoCapital: formatearNumeroBrutosAMiles(prorroga.abonoCapital),
      saldoCapitalActualizado: formatearNumeroBrutosAMiles(
        prorroga.saldoCapitalActualizado
      ),
      mesesProrroga: prorroga.mesesProrroga,
      fechaNuevaVencimiento: prorroga.fechaNuevaVencimiento,
      valorUfHoy: formatearNumeroBrutosAMiles(prorroga.valorUfHoy),
      comisionEnPesos: formateadorMilesSinDecimal(prorroga.comisionEnPesos),
      comisionEnPorcentaje: formatearNumeroBrutosAMiles(
        prorroga.comisionEnPorcentaje
      ),
      seguroValorAnual: formatearNumeroBrutosAMiles(prorroga.seguroValorAnual),
      seguroCantidadMeses: formatearNumeroBrutosAMiles(
        prorroga.seguroCantidadMeses
      ),
      seguroValorMensual: formatearNumeroBrutosAMiles(
        prorroga.seguroValorMensual
      ),
      contribucinesValorAnual: formateadorMilesSinDecimal(
        prorroga.contribucinesValorAnual
      ),
      contribucionesCantidadMeses: formatearNumeroBrutosAMiles(
        prorroga.contribucionesCantidadMeses
      ),
      contribucionesValorMensual: formatearNumeroBrutosAMiles(
        prorroga.contribucionesValorMensual
      ),
      rentasValorEnPesos: formateadorMilesSinDecimal(
        prorroga.rentasValorEnPesos
      ),
      fechaFirmaCurse: prorroga.fechaFirmaCurse,
      valorUfFechaCurse: formatearNumeroBrutosAMiles(
        prorroga.valorUfFechaCurse
      ),
      valorRentaCurse: formatearNumeroBrutosAMiles(prorroga.valorRentaCurse),
      valorTasaContrato: formatearNumeroBrutosAMiles(
        prorroga.valorTasaContrato
      ),
      valorTasaCliente: formatearNumeroBrutosAMiles(prorroga.valorTasaCliente),
      sobretasaMensual: formatearNumeroBrutosAMiles(prorroga.sobretasaMensual),
      sobretasaProrroga: formatearNumeroBrutosAMiles(
        prorroga.sobretasaProrroga
      ),
      gastosOperacionales: formatearNumeroBrutosAMiles(
        prorroga.gastosOperacionales
      ),
      gastosLegales: formatearNumeroBrutosAMiles(prorroga.gastosLegales),
    });

    this.modalProrrogaAgregarEditar.abrirModal();
  }

  editarProrroga() {
    this.sSalidas
      .modificarProrrogaPorCliente(this.formAgregarProrroga.value)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'Exito',
              mensaje: response.mensaje,
            });
            this.modalProrrogaAgregarEditar.cerrarModal();
            this.obtenerDataCliente();
            return;
          }
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        },
      });
  }

  modalDetalleProrroga(prorroga: Prorroga) {
    this.id_cliente = prorroga.id_cliente.toString();
    this.id_prorroga_imprimir = prorroga.id_prorroga;
    this.modalProrrogaVizualizar.abrirModal();

    this.detalleProrroga = {
      valorMinimo: this.formatearNumero(prorroga.saldoCapital) / 0.97,
      opcionRecompra: this.formatearNumero(prorroga.saldoCapitalActualizado),
      comisionProrroga:
        (this.formatearNumero(prorroga.comisionEnPorcentaje) / 100) *
        this.formatearNumero(prorroga.saldoCapitalActualizado),
      contribucionesProrroga: this.formatearNumero(
        prorroga.contribucionesValorMensual
      ),
      seguroProrroga: this.formatearNumero(prorroga.seguroValorMensual),
      arriendoProrroga:
        this.formatearNumero(prorroga.saldoCapitalActualizado) *
        Number(prorroga.mesesProrroga) *
        (this.formatearNumero(prorroga.valorTasaCliente) / 100),
      gastosOperacionales: this.formatearNumero(prorroga.gastosOperacionales),
      gastosLegales: this.formatearNumero(prorroga.gastosLegales),
      total: 0,
      fechaInicial: prorroga.fechaVencimientoActual.toString().split('T')[0],
      fechaProrrogaNueva: prorroga.fechaNuevaVencimiento
        .toString()
        .split('T')[0],
      mesesProrroga: prorroga.mesesProrroga,
    };
    this.detalleProrroga = {
      ...this.detalleProrroga,
      total:
        this.detalleProrroga.comisionProrroga +
        this.detalleProrroga.contribucionesProrroga +
        this.detalleProrroga.seguroProrroga +
        this.detalleProrroga.arriendoProrroga +
        this.detalleProrroga.gastosOperacionales +
        this.detalleProrroga.gastosLegales +
        this.formatearNumero(prorroga.saldoCapital) /
          this.formatearNumero(prorroga.saldoCapitalActualizado),
    };
  }

  eliminarProrroga(id_prorroga: number) {
    mostrarConfirmacion(
      'Confirmar Eliminación',
      '¿Está seguro de que desea eliminar esta prórroga? Esta acción no se puede deshacer.'
    ).then((confirmed) => {
      if (confirmed) {
        this.sSalidas.eliminarProrrogaPorCliente(id_prorroga).subscribe({
          next: (response) => {
            if (response.ok) {
              mostrarMensaje({
                icono: IconoSweetAlert.Success,
                titulo: 'Prórroga Eliminada',
                mensaje: response.mensaje,
              });
              this.obtenerProrrogas();
            } else {
              mostrarMensaje({
                icono: IconoSweetAlert.Error,
                titulo: 'Error',
                mensaje: response.mensaje,
              });
            }
          },
        });
      }
    });
  }

  validarProrrogaAceptada(prorroga: Prorroga): void {
    mostrarConfirmacion(
      'Confirmar Acción',
      '¿Está seguro de que desea aceptar esta prórroga? Esta acción no se puede deshacer.'
    ).then((confirmed) => {
      if (confirmed) {
        this.sSalidas
          .aceptarProrrogaPorCliente(prorroga.id_prorroga)
          .subscribe({
            next: (response) => {
              if (response.ok) {
                this.obtenerProrrogas();

                mostrarMensaje({
                  icono: IconoSweetAlert.Success,
                  titulo: 'Prórroga Aceptada',
                  mensaje: response.mensaje,
                });
              } else {
                mostrarMensaje({
                  icono: IconoSweetAlert.Error,
                  titulo: 'Error',
                  mensaje: response.mensaje,
                });
              }
            },
          });
      }
    });
  }

  imprimirDetalle(tipo: 'cliente' | 'inversionista') {
    this.sSalidas
      .exportarFichaDetalleProrroga(this.id_prorroga_imprimir, tipo)
      .subscribe({
        next: (response) => {
          const base64 = response.archivo;
          const pdfBlob = new Blob(
            [Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))],
            { type: 'application/pdf' }
          );

          const url = window.URL.createObjectURL(pdfBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = response.nombre_archivo;
          a.click();

          setTimeout(() => window.URL.revokeObjectURL(url), 10000);
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error);
        },
      });
  }
}
