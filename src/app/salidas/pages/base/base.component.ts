import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { SalidasService } from 'src/app/services';

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
    private sSalida: SalidasService
  ) { }

  ngOnInit(): void {
    this.activedRouter.params
      .subscribe(({ idCliente }) => {
        this.idCliente = idCliente
        this.sSalida.setIdCliente(this.idCliente); // Pasamos el idCliente al servicio
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
        error: (error: HttpErrorResponse) => {
          console.error('Error al obtener los datos:', error);
          return this.router.navigate(['/salidas']);
        }
      });
  }
}
