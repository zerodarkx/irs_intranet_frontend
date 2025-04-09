import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-detalle-corretaje',
  templateUrl: './detalle-corretaje.component.html',
  styleUrls: ['./detalle-corretaje.component.css']
})
export class DetalleCorretajeComponent {

  formDetallePropiedad!: FormGroup;

  constructor(
    private fb: FormBuilder
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


}
