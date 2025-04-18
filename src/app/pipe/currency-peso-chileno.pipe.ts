import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyPesoChileno'
})
export class CurrencyPesoChilenoPipe implements PipeTransform {

  transform(value: number | string | undefined, decimales: boolean = true): string {

    if (!value) return '0';
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;

    const formatter = new Intl.NumberFormat('es-CL', {
      minimumFractionDigits: decimales ? 2 : 0,
      maximumFractionDigits: decimales ? 2 : 0,
    });

    return formatter.format(numberValue);
  }

}
