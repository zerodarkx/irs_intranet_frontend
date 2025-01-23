import { Component } from '@angular/core';
import { CargandoService } from 'src/app/services/cargando.service';

@Component({
  selector: 'shared-cargando',
  templateUrl: './cargando.component.html',
  styleUrls: ['./cargando.component.css']
})
export class CargandoComponent {
  isLoading = this.sCargando.isLoading$;

  constructor(
    private sCargando: CargandoService
  ) {
  }




}
