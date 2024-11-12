import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'navbar-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class NavbarAgregarClienteComponent {
  constructor(
    private sAuth: AuthService
  ){}

  cerrarSession(){
    this.sAuth.cerrarSession();
  }
}
