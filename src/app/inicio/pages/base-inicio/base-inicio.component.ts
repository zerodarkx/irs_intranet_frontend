import { Component } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Payload } from 'src/app/interfaces/auth';
import { GraficosService } from 'src/app/services/graficos.service';

@Component({
  selector: 'inicio-base',
  templateUrl: './base-inicio.component.html',
  styleUrls: ['./base-inicio.component.css']
})
export class BaseInicioComponent {

  perfil: number;

  constructor() {
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode<Payload>(token!);
    this.perfil = decodedToken.perfil
  }



}
