import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'navbar-buscar-cliente',
  templateUrl: './buscar-cliente.component.html',
  styleUrls: ['./buscar-cliente.component.css']
})
export class NavbarBuscarClienteComponent {
  constructor(
    private sAuth: AuthService
  ){}

  cerrarSession(){
    this.sAuth.cerrarSession();
  }

}
