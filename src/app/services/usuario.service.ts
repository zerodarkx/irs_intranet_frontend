import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment.development';
import { ResultadoObtenerEjecutivoYbroker } from '../interfaces/cliente';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url_base: string = `${env.apiUrl}/usuario`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerEjecutivosBrokers(): Observable<ResultadoObtenerEjecutivoYbroker> {
    let url = `${this.url_base}/obtenerEjecutivosYbrokers`;
    return this.http.get<ResultadoObtenerEjecutivoYbroker>(url);
  }
}
