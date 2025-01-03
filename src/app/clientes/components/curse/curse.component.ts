import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentosCurse, ResultadoNuevoDocumentoCurse, ResultadoObtenerDocumentosCurse } from 'src/app/interfaces/cliente';
import { ResultadoTipoDocumentosCurse, TipoDocumentoCurse } from 'src/app/interfaces/tipoDocumentosCurse';
import { ClienteService } from 'src/app/services/cliente.service';
import { TipoDocumentosCurseService } from 'src/app/services/tipo-documentos-curse.service';
import { abrirModal, cerrarModal } from 'src/app/shared/utils/bootstrap';
import { formateadorMiles } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { env } from 'src/environments/environment';

@Component({
  selector: 'app-curse',
  templateUrl: './curse.component.html',
  styleUrls: ['./curse.component.css']
})
export class CurseComponent implements OnInit {

  url: string = env.descargaUrl;
  fechaNueva: string = new Date().getTime().toString();

  isAlertVisible: boolean = false;

  documentosCurse: DocumentosCurse[] = [];
  selectTipoDocumentoCurse: TipoDocumentoCurse[] = [];

  selectedDocuemento: File | null = null;

  formDocumentoCurse: FormGroup = this.fb.group({
    id_documento: [, [
      Validators.required
    ]],
    moneda: [, [
      Validators.required
    ]],
    monto: ['', [
      Validators.required
    ]],
    tipo_cuota: [, [
      Validators.required
    ]],
    cuotas: ['', [
      Validators.required
    ]],
    f_firma: ['', [
      Validators.required
    ]],
    f_termino: ['', [
      Validators.required
    ]],
    f_primer_vencimiento: ['', [
      Validators.required
    ]],
    documento: ['', [
      Validators.required
    ]]
  });

  formEditarDocumentoCurse: FormGroup = this.fb.group({
    id_documentoCurse: [0],
    moneda: [, [
      Validators.required
    ]],
    monto: ['', [
      Validators.required
    ]],
    tipo_cuota: [, [
      Validators.required
    ]],
    cuotas: ['', [
      Validators.required
    ]],
    fecha_contrato: ['', [
      Validators.required
    ]],
    fecha_termino: ['', [
      Validators.required
    ]],
    fecha_vencimiento: ['', [
      Validators.required
    ]]
  });

  formEditarArchivo: FormGroup = this.fb.group({
    id_documentoCurse: [],
    documento: ['', [
      Validators.required
    ]]
  });

  formDatosCursado: FormGroup = this.fb.group({
    fecha_cursado_inicio: ['', [
      Validators.required
    ]],
    fecha_cursado_termino: ['', [
      Validators.required
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private sCliente: ClienteService,
    private sTipoDocumentoCurse: TipoDocumentosCurseService
  ) {

  }
  ngOnInit(): void {
    this.cargarData();
    this.cargarTipoDocumentoCurse();
    this.obtenerFechas();
  }

  obtenerFechas() {
    this.sCliente.obtenerFechaCursadoCliente()
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.formDatosCursado.patchValue({
              fecha_cursado_inicio: response.data.fecha_cursado_inicio,
              fecha_cursado_termino: response.data.fecha_cursado_termino
            })
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formDocumentoCurse.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  cargarData() {
    this.sCliente.obtenerDocumentosCurse()
      .subscribe({
        next: (response: ResultadoObtenerDocumentosCurse) => {
          if (response.ok) {
            this.documentosCurse = response.data;
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  cargarTipoDocumentoCurse() {
    this.sTipoDocumentoCurse.obtenerTodosTipoDocumentos()
      .subscribe({
        next: (response: ResultadoTipoDocumentosCurse) => {
          if (response.ok) {
            this.selectTipoDocumentoCurse = response.data;
          }
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    const file = input.files ? input.files[0] : null;
    if (file) {
      this.selectedDocuemento = file;
    } else {
      this.selectedDocuemento = null; // Reiniciar si no hay archivo
    }
  }

  guardarDocumentoCurse() {
    if (this.formDocumentoCurse.invalid || !this.selectedDocuemento) {
      this.showAlert()
      return;
    }

    const formData = new FormData();
    formData.append('archivo', this.selectedDocuemento); // Archivo
    formData.append('data', JSON.stringify(this.formDocumentoCurse.value)); // Texto

    this.sCliente.agregarDocumentoCurse(formData)
      .subscribe({
        next: (response: ResultadoNuevoDocumentoCurse) => {
          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'exito',
              mensaje: response.data.mensaje
            });

            this.cargarData();
            return
          }

          mostrarMensaje({
            icono: IconoSweetAlert.Error,
            titulo: 'atencion',
            mensaje: response.data.mensaje
          });

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  async eliminarDocumentoCurse(id_documento: number) {
    if (await mostrarConfirmacion('Atención', 'estas seguro de eliminar la imagen')) {
      this.sCliente.eliminarDocumentoCurse(id_documento)
        .subscribe({
          next: (data: any) => {
            mostrarMensaje({
              icono: data.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
              mensaje: data.data.mensaje,
              titulo: data.ok ? "Exito" : "Atención"
            })
            this.formDocumentoCurse.reset();
            this.cargarData()
          },
          error: (error: HttpErrorResponse) => {
            errorConexionServidor(error)
          }
        })
    }
  }

  abrirEditarArchivoDocumentoCurse(id_documentoCurse: number) {
    this.selectedDocuemento = null;
    this.formEditarArchivo.patchValue({
      id_documentoCurse: id_documentoCurse,
      documento: ''
    });
    abrirModal('editarArchivoDocumentoCurse');
  }

  editarArchivoDocumentoCurse() {
    if (this.formEditarArchivo.invalid || !this.selectedDocuemento) {
      this.showAlert()
      return;
    }

    const formData = new FormData();
    formData.append('archivo', this.selectedDocuemento); // Archivo
    formData.append('id_documentoCurse', this.formEditarArchivo.get('id_documentoCurse')?.value); // Texto

    this.sCliente.editarArchivoDocumentoCurse(formData)
      .subscribe({
        next: (response: ResultadoNuevoDocumentoCurse) => {
          console.log(response);

          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'exito',
              mensaje: response.data.mensaje
            });

            this.cargarData();
            cerrarModal();
            return
          }

          mostrarMensaje({
            icono: IconoSweetAlert.Error,
            titulo: 'atencion',
            mensaje: response.data.mensaje
          });
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  abrirEditarDocumentoCurse(curse: DocumentosCurse) {
    this.formEditarDocumentoCurse.patchValue({
      id_documentoCurse: curse.id_documentoCurse,
      moneda: curse.moneda,
      monto: curse.monto,
      tipo_cuota: curse.tipo_cuota,
      cuotas: curse.cuotas,
      fecha_contrato: curse.fecha_contrato,
      fecha_termino: curse.fecha_termino,
      fecha_vencimiento: curse.fecha_vencimiento,
    })
    abrirModal('editarDocumentoCurse');
  }

  editarDocumentoCurse() {
    this.sCliente.editarDocumentoCurse(this.formEditarDocumentoCurse.value)
      .subscribe({
        next: (response: ResultadoNuevoDocumentoCurse) => {
          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'exito',
              mensaje: response.data.mensaje
            });

            this.cargarData();
            cerrarModal();
            return
          }

          mostrarMensaje({
            icono: IconoSweetAlert.Error,
            titulo: 'atencion',
            mensaje: response.data.mensaje
          });

        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error)
        }
      })
  }

  showAlert() {
    this.isAlertVisible = true;
    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
      this.isAlertVisible = false;
    }, 5000);
  }

  guardarFechaCursado() {
    this.sCliente.agregarFechaCursadoCliente(this.formDatosCursado.value)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: "Exito",
              mensaje: "se guardo correctamente"
            });
            return;
          }
          mostrarMensaje({
            icono: IconoSweetAlert.Error,
            titulo: "Atencion",
            mensaje: "no se guardo correctamente"
          });
        },
        error: (error: HttpErrorResponse) => {
          errorConexionServidor(error);
        }
      })
  }

}
