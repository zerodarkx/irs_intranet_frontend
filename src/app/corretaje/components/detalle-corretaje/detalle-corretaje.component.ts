import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropiedadesService } from 'src/app/services';
import { IconoSweetAlert, mostrarMensaje } from 'src/app/shared/utils/sweetAlert';

@Component({
  selector: 'app-detalle-corretaje',
  templateUrl: './detalle-corretaje.component.html',
  styleUrls: ['./detalle-corretaje.component.css']
})
export class DetalleCorretajeComponent {

  formDetallePropiedad!: FormGroup;
  estado_actual: string = '';

  estados = ['REVISIÓN Y ASIGNACIÓN', 'PUBLICACIÓN EN PORTALES', 'MÓDULO INTERMADIO', 'LEGAL/OPERACIONES', 'NOTARÍA', 'CIERRE'];

  constructor(
    private fb: FormBuilder,
    private sPropiedades: PropiedadesService,
  ) { }

  ngOnInit() {
    this.formDetallePropiedad = this.fb.group({});
    this.obtenerDetallePropiedad();
  }

  // Función que genera las clases dinámicamente
  getButtonClasses(controlName: string, selectedValue: string): string {
    const value = this.formDetallePropiedad.get(controlName)?.value;
    return value === selectedValue ? 'btn-success' : 'btn-outline-secondary';
  }

  // Otra función para manejar el cambio de estado de los radio buttons
  setButtonValue(controlName: string, value: string) {
    this.formDetallePropiedad.get(controlName)?.setValue(value);
  }

  obtenerDetallePropiedad() {
    this.sPropiedades.obtenerPropiedadesPorId()
      .subscribe({
        next: (resp) => {
          console.log(resp);
          this.estado_actual = this.estados[resp.data.id_estado - 1];
        },
        error: (error) => {
          console.error('Error al obtener los detalles de la propiedad:', error);
        }
      })
  }

  siguienteEstado() {
    this.sPropiedades.cambiarEstadoPropiedad(1)
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.estado_actual = this.estados[res.data.id_estado - 1];
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'Estado cambiado',
              mensaje: 'El estado de la propiedad ha sido cambiado exitosamente a ' + this.estado_actual
            });
          } else {
            // Aquí puedes manejar el error
            console.error('Error al cambiar el estado');
          }
        },
        error: (error) => {
          // Manejo de errores
          console.error('Error en la solicitud:', error);
        }
      })
  }

  volverEstado() {
    this.sPropiedades.cambiarEstadoPropiedad(0)
      .subscribe({
        next: (res) => {
          if (res.ok) {
            this.estado_actual = this.estados[res.data.id_estado - 1];
            mostrarMensaje({
              icono: IconoSweetAlert.Success,
              titulo: 'Estado cambiado',
              mensaje: 'El estado de la propiedad ha sido cambiado exitosamente a ' + this.estado_actual
            });
          } else {
            // Aquí puedes manejar el error
            console.error('Error al cambiar el estado');
          }
        },
        error: (error) => {
          // Manejo de errores
          console.error('Error en la solicitud:', error);
        }
      })
  }


}
