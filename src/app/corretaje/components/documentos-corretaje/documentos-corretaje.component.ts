import { Component } from '@angular/core';

import { PropiedadesService } from 'src/app/services';
import { ErrorHttpCustom, ObtenerTodosDocumentosPropiedad } from 'src/app/interfaces';

import { env } from 'src/environments/environment';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-documentos-corretaje',
  templateUrl: './documentos-corretaje.component.html',
  styleUrls: ['./documentos-corretaje.component.css']
})
export class DocumentosCorretajeComponent {
  url: string = env.descargaUrl;
  fechaNueva: string = new Date().getTime().toString();
  isAlertVisible: boolean = false;

  documentosCargadosPropiedad: ObtenerTodosDocumentosPropiedad[] = [];

  documentosSelect = [
    { id: 1, nombre: 'Tasacion' },
    { id: 2, nombre: 'Copia de inscripción de dominio vigente en el conservador de bienes raíces conjuntamente con certificado de vigencia de fecha reciente ( 30 días )' },
    { id: 3, nombre: 'Certificado de hipotecas y gravámenes, con litigios y antigüedad no superior a 30 días' },
    { id: 4, nombre: 'Las escrituras públicas de compra venta o aquellas por las cuales se adquirió el dominio sobre el inmueble' },
    { id: 5, nombre: 'Demás antecedentes hasta completar 10 años, tales como inscripciones anteriores, compraventas, pagos de saldos de precios y cancelaciones, escrituras de poderes en caso que hayan personas jurídicas en los propietarios anteriores etc.' },
    { id: 6, nombre: 'Si hay sub división o fusión de lotes, copias de planos con sus respectivos certificados que acrediten las aprobaciones que correspondan, municipalidad, SAG o la entidad que corresponda, registro de plano, certificados de asignación de roles o aprobación de la fusión emitida por el SII, etc.' },
    { id: 7, nombre: 'Certificado deuda contribuciones' },
    { id: 8, nombre: 'Certificado de no expropiación municipal' },
    { id: 9, nombre: 'Certificado de Numeros Municipal' },
    { id: 10, nombre: 'Certificado de no expropiación Serviu' },
    { id: 11, nombre: 'En el caso de que existan propiedades arrendadas, adjuntar los contratos de arriendo.' },
    { id: 12, nombre: 'Certificado de avalúo fiscal detallado' },
    { id: 13, nombre: 'Personerias  y clausula de Alzamiento, en caso que propiedad posea una hipoteca, gravamén o litigio' },
  ];

  selectedDocuemento: File | null = null;
  formularioDocumento: FormGroup = this.fb.group({
    id_documento: [, Validators.required],
    archivo: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private sPropiedad: PropiedadesService
  ) { }

  ngOnInit(): void {
    this.cargarDocumentosPropiedad();
  }

  cargarDocumentosPropiedad() {

    this.sPropiedad.obtenerDocumentosPropiedad()
      .subscribe({
        next: ({ data }) => {
          this.fechaNueva = new Date().getTime().toString();
          this.documentosCargadosPropiedad = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
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

  showAlert() {
    this.isAlertVisible = true;
    // Ocultar la alerta después de 3 segundos
    setTimeout(() => {
      this.isAlertVisible = false;
    }, 5000);
  }

  agregarDocumentoPropiedad() {

    if (this.formularioDocumento.invalid || !this.selectedDocuemento) {
      this.showAlert()
      return;
    }

    // Crear FormData para enviar el archivo y el texto
    const formData = new FormData();
    formData.append('archivo', this.selectedDocuemento); // Archivo
    formData.append('id_documento', this.formularioDocumento.get('id_documento')?.value); // Texto


    // Enviar la solicitud POST con el archivo y el texto
    this.sPropiedad.agregarDocumentoPropiedad(formData)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            mensaje: response.data.mensaje,
            titulo: response.ok ? "Exito" : "Atención"
          })
          this.formularioDocumento.reset();
          this.cargarDocumentosPropiedad();
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

  async eliminarDocumento(id_documento: number) {

    if (await mostrarConfirmacion('Atención', 'estas seguro de eliminar el documento')) {
      this.sPropiedad.eliminarDocumentoPropiedad(id_documento)
        .subscribe({
          next: (data) => {
            mostrarMensaje({
              icono: data.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
              mensaje: data.data.mensaje,
              titulo: data.ok ? "Exito" : "Atención"
            })
            this.formularioDocumento.reset();
            this.cargarDocumentosPropiedad()
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }

}
