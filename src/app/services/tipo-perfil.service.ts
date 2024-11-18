import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { ResultadoAccionesPerfil, ResultadoObtenerTodosPerfiles } from '../interfaces/usuarioPerfiles';

@Injectable({
  providedIn: 'root'
})
export class TipoPerfilService {

  private url_base: string = `${env.apiUrl}/tipoPerfiles`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosPerfiles(): Observable<ResultadoObtenerTodosPerfiles>{
    let url = `${this.url_base}/obtenerTodosPerfilesUsuario`;
    return this.http.get<ResultadoObtenerTodosPerfiles>(url);
  }

  agregarTipoPerfil(data: any): Observable<ResultadoAccionesPerfil>{
    let url = `${this.url_base}/agregarTipoPerfil`;
    return this.http.post<ResultadoAccionesPerfil>(url, data);
  }

  editarTipoPerfil(data: any): Observable<ResultadoAccionesPerfil>{
    let url = `${this.url_base}/editarTipoPerfil`;
    return this.http.put<ResultadoAccionesPerfil>(url, data);
  }
}
