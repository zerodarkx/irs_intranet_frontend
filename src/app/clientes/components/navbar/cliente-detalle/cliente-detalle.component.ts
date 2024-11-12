import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'navbar-cliente-detalle',
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.css']
})
export class NavbarClienteDetalleComponent {

  constructor(
    private sAuth: AuthService
  ){}

  cerrarSession(){
    this.sAuth.cerrarSession();
  }


}
