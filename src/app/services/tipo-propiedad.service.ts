import { Injectable } from '@angular/core';
import { ResultadoAccionesTipoPropiedad, ResultadoObtenerTodosTipoPropiedad, TipoPropiedad } from '../interfaces/tipoPropiedad';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
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

  agregarTipoPropiedad(data: TipoPropiedad): Observable<ResultadoAccionesTipoPropiedad> {
    let url = `${this.url_base}/agregarTiposPropiedad`;
    return this.http.post<ResultadoAccionesTipoPropiedad>(url, data);
  }

  editarTipoPropiedad(data: TipoPropiedad): Observable<ResultadoAccionesTipoPropiedad> {
    let url = `${this.url_base}/editarTiposPropiedad`;
    return this.http.put<ResultadoAccionesTipoPropiedad>(url, data);
  }
}
