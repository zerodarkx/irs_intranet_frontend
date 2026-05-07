import { Component } from '@angular/core';
import { PropiedadesService } from 'src/app/services';
import {
  IconoSweetAlert,
  mostrarMensaje,
} from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-sincronizar',
  templateUrl: './sincronizar.component.html',
  styleUrls: ['./sincronizar.component.css'],
})
export class SincronizarComponent {
  fondo: number = 0;

  constructor(private sPropiedad: PropiedadesService) {
    this.traerFondo();
  }

  traerFondo() {
    this.sPropiedad.traerFondo().subscribe({
      next: (res) => {
        this.fondo = res.data;
      },
      error: (err) => {
        mostrarMensaje({
          icono: IconoSweetAlert.Error,
          titulo: 'Error al traer fondo',
          mensaje: 'Ocurrió un error al intentar traer el fondo.',
        });
      },
    });
  }

  guardarFondo() {
    this.sPropiedad.guardarFondo(this.fondo).subscribe({
      next: (res) => {
        mostrarMensaje({
          icono: IconoSweetAlert.Success,
          titulo: 'Fondo guardado',
          mensaje: 'El fondo se ha guardado correctamente.',
        });
      },
      error: (err) => {
        mostrarMensaje({
          icono: IconoSweetAlert.Error,
          titulo: 'Error al guardar fondo',
          mensaje: 'Ocurrió un error al intentar guardar el fondo.',
        });
      },
    });
  }

  sincronizar() {
    this.sPropiedad.sincronizarPropiedad().subscribe({
      next: (res) => {
        mostrarMensaje({
          icono: IconoSweetAlert.Success,
          titulo: 'Propiedad sincronizada',
          mensaje:
            'La propiedad se ha sincronizado correctamente con el sistema.',
        });
      },
      error: (err) => {
        mostrarMensaje({
          icono: IconoSweetAlert.Error,
          titulo: 'Error al sincronizar propiedad',
          mensaje: 'Ocurrió un error al intentar sincronizar la propiedad.',
        });
      },
    });
  }
}
