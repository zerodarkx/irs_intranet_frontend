import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Payload } from 'src/app/interfaces';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  perfil: number;

  constructor() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode<Payload>(token!);
    console.log(decodedToken.perfil);
    
    
    this.perfil = decodedToken.perfil
  }
}
