import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputPesoChileno'
})
export class InputPesoChilenoPipe implements PipeTransform {

  transform(value: number | string): string {
    const montoNumerico = parseFloat(value.toString().replace(/[^0-9.-]+/g, '')) || 0;
    return new Intl.NumberFormat('es-CL', {
      // style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
    }).format(montoNumerico);
  }
}
