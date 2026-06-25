import { Component } from '@angular/core';

@Component({
  selector: 'app-simulador-inversionista',
  templateUrl: './simulador-inversionista.component.html',
  styleUrls: ['./simulador-inversionista.component.css']
})
export class SimuladorInversionistaComponent {

  datosPrevios:any = {
    monto_cliente: 0,
    monto_inversionista: 0,
    monto_total: 0,
    porcentaje_cliente: 0,
    porcentaje_inversionista: 0
  }

}
