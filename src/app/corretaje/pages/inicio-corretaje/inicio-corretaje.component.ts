import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadesService } from 'src/app/services';

@Component({
  selector: 'app-inicio-corretaje',
  templateUrl: './inicio-corretaje.component.html',
  styleUrls: ['./inicio-corretaje.component.css']
})
export class InicioCorretajeComponent {

  idPropiedad: string = '';

  constructor(
    private activedRouter: ActivatedRoute,
    private sPropiedades: PropiedadesService,
    private router: Router
  ) {
    this.activedRouter.params
      .subscribe(({ idPropiedad }) => {
        this.idPropiedad = idPropiedad
        this.sPropiedades.setIdPropiedad(this.idPropiedad); // Pasamos el idCliente al servicio
      })

    // this.verificarExisteCliente();
  }

  volverAtrasPagina(){
    this.router.navigate(['/propiedades'])
  }


}
