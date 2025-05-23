import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHttpCustom } from 'src/app/interfaces';

import { ClienteService } from 'src/app/services';

@Component({
  selector: 'cliente-layout',
  templateUrl: './layout-cliente.component.html',
  styles: []
})
export class LayoutClienteComponent {

  idCliente: string = '';

  constructor(
    private activedRouter: ActivatedRoute,
    private sCliente: ClienteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activedRouter.params
      .subscribe(({ idCliente }) => {
        this.idCliente = idCliente
        this.sCliente.setIdCliente(this.idCliente); // Pasamos el idCliente al servicio
      })

    this.verificarExisteCliente();
  }

  verificarExisteCliente() {
    this.sCliente.existeClienteSistema()
      .subscribe({
        next: (response) => {
          if (!response.ok) return this.router.navigate(['/cliente']);
          return
        },
        error: (error: ErrorHttpCustom) => {
          return this.router.navigate(['/cliente']);
        }
      });
  }

  volverAtrasPagina(){
    this.router.navigate(['/cliente'])
  }


}
