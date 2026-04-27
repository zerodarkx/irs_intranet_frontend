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
  constructor(private sPropiedad: PropiedadesService) {}

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
