import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';
import { ResultadoObtenerEstados } from '../interfaces/estado';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadoClientesService {

  private url_base: string = `${env.apiUrl}/clienteEstado`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosLosEstados(): Observable<ResultadoObtenerEstados> {
    let url = `${this.url_base}/obtenerTodosEstadoCliente`;
    return this.http.get<ResultadoObtenerEstados>(url);
  }
}
