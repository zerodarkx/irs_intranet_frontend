import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment.development';
import { ResultadoObtenerTodosCodigoTelefono } from '../interfaces/telefonoCodigo';

@Injectable({
  providedIn: 'root'
})
export class CodigoTelefonoService {

  private url_base: string = `${env.apiUrl}/telefonoCodigo`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosCodigoTelefono(): Observable<ResultadoObtenerTodosCodigoTelefono>{
    let url = `${this.url_base}/obtenerTodosCodigoTelefono`;
    return this.http.get<ResultadoObtenerTodosCodigoTelefono>(url);
  }
}

