import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BitacoraPropiedad, ErrorHttpCustom } from 'src/app/interfaces';
import { PropiedadesService } from 'src/app/services';
import { usuariosConvecta } from 'src/app/shared/utils/convetaUtils';
import { errorConexionServidor, IconoSweetAlert, mostrarConfirmacion, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-bitacora-corretaje',
  templateUrl: './bitacora-corretaje.component.html',
  styleUrls: ['./bitacora-corretaje.component.css']
})
export class BitacoraCorretajeComponent {

  comentariosBitacoraDetalle!: BitacoraPropiedad;
  comentariosBitacora: BitacoraPropiedad[] = [];

  formBitacora: FormGroup = this.fb.group({
    id_bitacora: [0],
    observacion_bitacora: ['', [
      Validators.required,
      Validators.minLength(6)
    ]],
    ejecutivo: [, Validators.required]
  });

  selectCorredores = usuariosConvecta;

  constructor(
    private fb: FormBuilder,
    private sPropiedades: PropiedadesService
  ) { }

  ngOnInit(): void {
    this.obtenerComentarios();
  }

  obtenerComentarios() {
    this.sPropiedades.obtenerBitacoraPropiedad()
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
    console.log(this.formBitacora.value);

    this.sPropiedades.agregaBitacoraPropiedad(this.formBitacora.value)
      .subscribe({
        next: (response) => {
          mostrarMensaje({
            icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
            mensaje: response.ok ? 'Se agrego bitacora con exito' : 'Error al agregar bitacora',
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

  async eliminarBitacora(id_bitacora: number) {
    if (await mostrarConfirmacion('Estas seguro de eliminar', 'se eliminara la bitacora')) {
      this.sPropiedades.eliminarBitacoraPropiedad(id_bitacora)
        .subscribe({
          next: (response) => {
            if (response.ok) {
              this.obtenerComentarios();
            }
            mostrarMensaje({
              icono: response.ok ? IconoSweetAlert.Success : IconoSweetAlert.Error,
              titulo: response.ok ? "Exito" : "Atencion",
              mensaje: response.ok ? "Se elimino correctamente" : "Error al eliminar"
            })
          },
          error: (error: ErrorHttpCustom) => {
            errorConexionServidor(error)
          }
        })
    }
  }

  obtenerUsuarioConvecta(id_usuario: number) {  
    const usuario = this.selectCorredores.find(usuario => usuario.idUser === id_usuario);
    return usuario ? usuario.nombreCompleto : '';
  }
}
