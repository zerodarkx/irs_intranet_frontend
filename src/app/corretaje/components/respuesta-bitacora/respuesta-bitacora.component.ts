import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PropiedadesService } from 'src/app/services';
import {
  IconoSweetAlert,
  mostrarMensaje,
} from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-respuesta-bitacora',
  templateUrl: './respuesta-bitacora.component.html',
  styleUrls: ['./respuesta-bitacora.component.css'],
})
export class RespuestaBitacoraComponent {
  idRespuesta: string = '';
  id_propiedad: string = '';
  formDetallePropiedad!: FormGroup;
  observacionBitacora: string = '';

  formRespuesta = this.fb.group({
    respuesta: [''],
  });

  constructor(
    private activedRouter: ActivatedRoute,
    private fb: FormBuilder,
    private sPropiedades: PropiedadesService,
  ) {
    this.activedRouter.params.subscribe(({ idRespuesta }) => {
      this.idRespuesta = idRespuesta;
      this.sPropiedades
        .obtenerBitacoraPorId(this.idRespuesta)
        .subscribe((bitacora) => {
          this.observacionBitacora = bitacora.data.observacion_bitacora;
          this.id_propiedad = bitacora.data.id_propiedad;
          this.formRespuesta.patchValue({
            respuesta: bitacora.data.respuesta_bitacora,
          });
        });
    });
  }

  guardarRespuesta() {
    this.sPropiedades
      .agregarRespuestaBitacora(
        this.idRespuesta,
        this.formRespuesta.value.respuesta!,
      )
      .subscribe((res) => {
        if (res.ok) {
          mostrarMensaje({
            icono: IconoSweetAlert.Success,
            titulo: 'Exito',
            mensaje: 'Mensaje Guardado con Exito',
          });
        } else {
          mostrarMensaje({
            icono: IconoSweetAlert.Error,
            titulo: 'Error',
            mensaje: 'Error al guardar la respuesta',
          });
        }
      });
  }
}
