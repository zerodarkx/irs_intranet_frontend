import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHttpCustom } from 'src/app/interfaces';

import { ClienteService, SalidasService } from 'src/app/services';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent {
  idCliente: string = '';
  constructor(
    private activedRouter: ActivatedRoute,
    private router: Router,
    private sSalida: SalidasService,
    private sCliente: ClienteService
  ) { }

  ngOnInit(): void {
    this.activedRouter.params
      .subscribe(({ idCliente }) => {
        this.idCliente = idCliente
        this.sSalida.setIdCliente(this.idCliente); // Pasamos el idCliente al servicio
        this.sCliente.setIdCliente(this.idCliente); // Pasamos el idCliente al servicio
      });

    this.verificarExisteCliente();
  }

  verificarExisteCliente() {
    this.sSalida.existeClienteSistema()
      .subscribe({
        next: (response) => {
          if (!response.ok) return this.router.navigate(['/salidas']);
          return
        },
        error: (error: ErrorHttpCustom) => {
          console.error('Error al obtener los datos:', error);
          return this.router.navigate(['/salidas']);
        }
      });
  }

  volverAtrasPagina() {
    this.router.navigate(['/salidas'])
  }
}
