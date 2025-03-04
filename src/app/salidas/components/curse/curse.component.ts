import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DocumentosCurse, ErrorHttpCustom, TipoDocumentoCurse } from 'src/app/interfaces';
import { ClienteService, TipoDocumentosCurseService } from 'src/app/services';

import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

import { formateadorMiles } from 'src/app/shared/utils/formateadores';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

import { env } from 'src/environments/environment';

@Component({
  selector: 'app-curse',
  templateUrl: './curse.component.html',
  styleUrls: ['./curse.component.css']
})
export class CurseComponent {
  @ViewChild('modalEditarDocumentoCurse') modalEditarDocumentoCurse!: ModalComponent;
  @ViewChild('modalEditarArchivoDocumentoCurse') modalEditarArchivoDocumentoCurse!: ModalComponent;

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

  constructor(
    private fb: FormBuilder,
    private sCliente: ClienteService,
    private sTipoDocumentoCurse: TipoDocumentosCurseService
  ) {

  }
  ngOnInit(): void {
    this.cargarData();
    this.cargarTipoDocumentoCurse();
  }

  formateadorMiles(event: Event) {
    const input = (event.target as HTMLInputElement)
    input.value = formateadorMiles(input.value)
    this.formDocumentoCurse.get(input.getAttribute('formControlName')!)?.setValue(input.value)
  }

  cargarData() {
    this.sCliente.obtenerDocumentosCurse()
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.documentosCurse = response.data;
          }
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  cargarTipoDocumentoCurse() {
    this.sTipoDocumentoCurse.obtenerTodosTipoDocumentos()
      .subscribe({
        next: (response) => {
          if (response.ok) {
            this.selectTipoDocumentoCurse = response.data;
          }
        },
        error: (error: ErrorHttpCustom) => {
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
        next: (response) => {
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
        error: (error: ErrorHttpCustom) => {
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
          error: (error: ErrorHttpCustom) => {
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
    this.modalEditarArchivoDocumentoCurse.abrirModal();
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
        next: (response) => {
          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'exito',
              mensaje: response.data.mensaje
            });

            this.cargarData();
            this.modalEditarArchivoDocumentoCurse.cerrarModal();
            return
          }

          mostrarMensaje({
            icono: IconoSweetAlert.Error,
            titulo: 'atencion',
            mensaje: response.data.mensaje
          });
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  abrirEditarDocumentoCurse(curse: DocumentosCurse) {
    this.formEditarDocumentoCurse.patchValue(curse)
    this.modalEditarDocumentoCurse.abrirModal();
  }

  editarDocumentoCurse() {
    this.sCliente.editarDocumentoCurse(this.formEditarDocumentoCurse.value)
      .subscribe({
        next: (response) => {
          if (response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'exito',
              mensaje: response.data.mensaje
            });

            this.cargarData();
            this.modalEditarDocumentoCurse.cerrarModal();
            return
          }

          mostrarMensaje({
            icono: IconoSweetAlert.Error,
            titulo: 'atencion',
            mensaje: response.data.mensaje
          });

        },
        error: (error: ErrorHttpCustom) => {
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
}
