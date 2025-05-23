import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropiedadesService } from 'src/app/services';

@Component({
  selector: 'app-detalle-corretaje',
  templateUrl: './detalle-corretaje.component.html',
  styleUrls: ['./detalle-corretaje.component.css']
})
export class DetalleCorretajeComponent {

  formDetallePropiedad!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private sPropiedades: PropiedadesService,
  ) { }

  ngOnInit() {
    this.formDetallePropiedad = this.fb.group({})
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

  siguienteEstado() {
    this.sPropiedades.cambiarEstadoPropiedad(1)
      .subscribe({
        next: (res) => {
          if (res.ok) {
            // Aquí puedes manejar la respuesta exitosa
            console.log('Estado cambiado exitosamente 1');
            alert('Estado avanzo exitosamente')
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
            // Aquí puedes manejar la respuesta exitosa
            console.log('Estado cambiado exitosamente 2');
            alert('Estado retrocedio exitosamente')
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
