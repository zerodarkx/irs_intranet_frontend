import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formatoMilesDecimalInput]'
})
export class FormatoNumericoMilesDecimalDirective {

  private separadorMiles = '.';
  private separadorDecimal = ',';

  constructor(private control: NgControl, private el: ElementRef) { }

  @HostListener('blur')
  onBlur() {
    let valor: string = this.el.nativeElement.value;

    if (!valor) return;

    // Quitar puntos para limpiar miles
    valor = valor.replace(/\./g, '');

    // Validar si tiene coma decimal
    const partes = valor.split(this.separadorDecimal);
    let parteEntera = partes[0];
    let parteDecimal = partes[1] || '';

    // Formatear la parte entera con separador de miles
    parteEntera = parteEntera.replace(/\B(?=(\d{3})+(?!\d))/g, this.separadorMiles);

    // Reconstruir valor final
    let valorFormateado = parteEntera;
    if (parteDecimal.length > 0) {
      valorFormateado += this.separadorDecimal + parteDecimal;
    }

    // Asignar valor formateado al control y al input
    this.control.control?.setValue(valorFormateado, { emitEvent: false });
    this.el.nativeElement.value = valorFormateado;
  }

}
