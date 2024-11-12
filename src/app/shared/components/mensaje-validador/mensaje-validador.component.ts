import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'shared-mensaje-validador',
  templateUrl: './mensaje-validador.component.html',
  styles: ['.letrasRojas{color: red;}']
})
export class MensajeValidadorComponent implements OnInit {

  // @Input() formulario!: FormGroup;
  // @Input() campo!: string;

  @Input('forControl') control!: AbstractControl | null;

  constructor() { }

  ngOnInit(): void {
  }

  get errorMsg(): string {
    let error = this.control!.errors;
    if (error!['required']) { return 'El campo es requerido'; }
    if (error!['email']) { return 'El campo debe tener formato e-mail'; }
    if (error!['minlength']) { return `El campo debe contener un minimo de ${error?.['minlength'].requiredLength}`; }
    if (error!['rutInvalido']) { return `El rut ingresado no es valido`; }
    if (error!['dominioIncorrecto']) { return `El dominio ingresado no puede ser registrado`; }
    if (error!['soloNumeros']) { return `Solo se pueden agregar numeros`; }
    return '';
  }

  // validarCampo(): boolean | null {
  //   return this.formulario.controls[this.campo].errors
  //     && this.formulario.controls[this.campo].touched;
  // }

  // obtenerMensajeError(): string | null {
  //   if (!this.formulario.controls[this.campo]) return null;

  //   const errors = this.formulario.controls[this.campo].errors || {};

  //   for (const key of Object.keys(errors)) {
  //     switch (key) {
  //       case 'required':
  //         return 'Esta campo es requerido;'
  //         break;

  //     }
  //   }

  //   return ''

  // }

}
