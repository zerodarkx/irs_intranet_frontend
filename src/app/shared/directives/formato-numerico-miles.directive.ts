import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formatoMilesInput]'
})
export class FormatoNumericoMilesDirective {

  constructor(private control: NgControl) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    let valor = event.target.value;

    if (!valor) return;

    // Quitar puntos y comas previos
    valor = valor.replace(/\./g, '').replace(/,/g, '');

    const numero = Number(valor);
    if (!isNaN(numero)) {
      const formateado = numero.toLocaleString('es-CL');
      this.control.control?.setValue(formateado, { emitEvent: false });
    }
  }

}
