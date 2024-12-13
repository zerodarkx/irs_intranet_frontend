import { Component, OnInit } from '@angular/core';
import { SubModuloCliente } from 'src/app/interfaces/menu';
import { jwtDecode } from 'jwt-decode';

interface Payload {
  permisos: string[];
  nombre: string;
  exp: number;
}

@Component({
  selector: 'cliente-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  permisosUsuario: string[] = [];

  menuDinamico: SubModuloCliente[] = [
    { nombre: 'Detalle', link: 'detalle', permiso: 'VER_DETALLE_CLIENTE' },
    { nombre: 'Simulador', link: 'simulador', permiso: 'VER_SIMULACION_CLIENTE' },
    { nombre: 'Reserva', link: 'reserva', permiso: 'VER_RESERVA_CLIENTE' },
    { nombre: 'Gestión', link: 'gestion', permiso: 'VER_GESTION_CLIENTE' },
    { nombre: 'Documentos', link: 'documentos', permiso: 'VER_DOCUMENTOS_CLIENTE' },
    { nombre: 'Ficha Comité', link: 'fichaComite', permiso: 'VER_FICHACOMITE_CLIENTE' },
    { nombre: 'Gastos Cliente', link: 'gastoCliente', permiso: 'VER_GASTOCLIENTE_CLIENTE' },
    { nombre: 'Curse', link: 'curse', permiso: 'VER_CURSE_CLIENTE' },
  ]

  constructor() { }
  ngOnInit(): void {
    this.verificarPermiso();
  }

  verificarPermiso() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<Payload>(token);
      let permisos: string[] = decodedToken.permisos;

      this.permisosUsuario = permisos;
      this.menuDinamico = this.menuDinamico.filter(menu =>
        this.permisosUsuario.includes(menu.permiso)
      );
    }
  }
}
