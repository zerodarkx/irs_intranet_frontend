import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { DataObtenerTodosDocumentosCliente, DataObtenerTodosImagenCliente, ErrorHttpCustom, ITipoDocumento, ITipoImagen } from 'src/app/interfaces';
import { ClienteService, PermisosService, TipoDocuentosService, TipoImagenesService } from 'src/app/services';

import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

import { env } from 'src/environments/environment';

@Component({
  selector: 'cliente-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.css']
})
export class DocumentosComponent {

  url: string = env.descargaUrl;
  fechaNueva: string = new Date().getTime().toString();

  isAlertVisible: boolean = false;
  permisos!: Record<string, any>;
  selectedDocuemento: File | null = null;
  selectedImagen: File | null = null;

  //select
  documentos: ITipoDocumento[] = [];
  imagenes: ITipoImagen[] = [];

  //documentos e imagenes cargados en sistema
  documentosCargadosCliente: DataObtenerTodosDocumentosCliente[] = []
  imagenesCargadosCliente: DataObtenerTodosImagenCliente[] = []

  formularioImagen: FormGroup = this.fb.group({
    archivo: ['', [
      Validators.required
    ]],
    selectImagen: [[], [
      Validators.required
    ]]
  });

  formularioDocumento: FormGroup = this.fb.group({
    archivo: [null, [
      Validators.required
    ]],
    selectDocumento: [[], [
      Validators.required
    ]]
  })

  constructor(
    private fb: FormBuilder,
    private sTipoDocumento: TipoDocuentosService,
    private sTipoImagen: TipoImagenesService,
    private sCliente: ClienteService,
    private sPermiso: PermisosService
  ) { }

  ngOnInit(): void {
    this.cargarSelect();
    this.cargarDocumentosEnSistema();
    this.cargarImagenesEnSistema();
    this.permisos = this.sPermiso.obtenerPermisos();
  }

  obtenerPermiso(modulo: string = '', categoria: string = '', subcategoria: string = '') {
    try {
      if (!modulo) return false;
      if (!categoria) return this.permisos[modulo].activo
      if (!subcategoria) return this.permisos[modulo].categorias[categoria].activo
      return this.permisos[modulo].categorias[categoria].subcategorias[subcategoria].activo
    } catch (error) {
      return false;
    }
  }

  cargarSelect() {
    const id_cliente = this.sCliente.id_cliente;

    this.sTipoDocumento.obtenerTodosTipoDocumentosPorLineaNegocio(id_cliente!)
      .subscribe({
        next: (response) => {
          if (!response.ok) {
            mostrarMensaje({
              icono: IconoSweetAlert.Warning,
              titulo: "Atencion",
              mensaje: "Falta agregar linea de negocio para subir documentos"
            })
          }
          this.documentos = response.data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });

    this.sTipoImagen.obtenerTodosTipoImagenes()
      .subscribe({
        next: ({ data }) => {
          this.imagenes = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  onFileSelected(event: Event, tipo: string): void {
    const input = event.target as HTMLInputElement
    const file = input.files ? input.files[0] : null;
    if (file) {
      if (tipo === 'documento') {
        this.selectedDocuemento = file;
      } else {
        this.selectedImagen = file;
      }
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

  cargarDocumentosEnSistema() {
    this.sCliente.mostrarTodosDocumentosCliente()
      .subscribe({
        next: ({ data }) => {
          this.fechaNueva = new Date().getTime().toString();
          this.documentosCargadosCliente = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  cargarImagenesEnSistema() {
    this.sCliente.mostrarTodosImagenesCliente()
      .subscribe({
        next: ({ data }) => {
          this.fechaNueva = new Date().getTime().toString();
          this.imagenesCargadosCliente = data
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      })
  }

  insertarDocumento() {
    if (this.formularioDocumento.invalid || !this.selectedDocuemento) {
      this.showAlert()
      return;
    }

    // Crear FormData para enviar el archivo y el texto
    const formData = new FormData();
    formData.append('archivo', this.selectedDocuemento); // Archivo
    formData.append('id_documento', this.formularioDocumento.get('selectDocumento')?.value); // Texto


    // Enviar la solicitud POST con el archivo y el texto
    this.sCliente.agregarDocumentoCliente(formData)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            mensaje: response.data.mensaje,
            titulo: response.ok ? "Exito" : "Atención"
          })
          this.formularioDocumento.reset();
          this.cargarDocumentosEnSistema()
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

  insertarImagen() {
    if (this.formularioImagen.invalid || !this.selectedImagen) {
      this.showAlert()
      return;
    }

    // Crear FormData para enviar el archivo y el texto
    const formData = new FormData();
    formData.append('archivo', this.selectedImagen); // Archivo
    formData.append('id_imagen', this.formularioImagen.get('selectImagen')?.value); // Texto


    // Enviar la solicitud POST con el archivo y el texto
    this.sCliente.agregarImagenCliente(formData)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            mensaje: response.data.mensaje,
            titulo: response.ok ? "Exito" : "Atención"
          })
          this.formularioImagen.reset();
          this.cargarImagenesEnSistema()
        },
        error: (error: ErrorHttpCustom) => {
          errorConexionServidor(error)
        }
      });
  }

  async eliminarDocumento(id_documento: number) {

    if (await mostrarConfirmacion('Atención', 'estas seguro de eliminar el documento')) {
      this.sCliente.eliminarDocumentoCliente(id_documento)
        .subscribe({
          next: (data) => {
            mostrarMensaje({
              icono: data.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
              mensaje: data.data.mensaje,
              titulo: data.ok ? "Exito" : "Atención"
            })
            this.formularioImagen.reset();
            this.cargarDocumentosEnSistema()
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }

  async eliminarImagen(id_imagen: number) {

    if (await mostrarConfirmacion('Atención', 'estas seguro de eliminar la imagen')) {
      this.sCliente.eliminarImagenCliente(id_imagen)
        .subscribe({
          next: (data) => {
            mostrarMensaje({
              icono: data.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
              mensaje: data.data.mensaje,
              titulo: data.ok ? "Exito" : "Atención"
            })
            this.formularioImagen.reset();
            this.cargarImagenesEnSistema()
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }
}
