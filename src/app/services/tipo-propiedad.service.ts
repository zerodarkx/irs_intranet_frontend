import { Injectable } from '@angular/core';
import { ResultadoObtenerTodosTipoPropiedad } from '../interfaces/tipoPropiedad';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoPropiedadService {

  private url_base: string = `${env.apiUrl}/tipoPropiedad`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodasLosTipoPropiedad(): Observable<ResultadoObtenerTodosTipoPropiedad> {
    let url = `${this.url_base}/obtenerTodosTiposPropiedad`;
    return this.http.get<ResultadoObtenerTodosTipoPropiedad>(url);
  }
}
