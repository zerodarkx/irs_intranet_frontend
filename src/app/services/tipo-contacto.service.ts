import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';
import { ResultadoAccionTipoCanalContacto, ResultadoTipoCanalContacto, TipoCanalContacto } from '../interfaces/tipoContacto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoContactoService {

  private url_base: string = `${env.apiUrl}/tipoCanalContacto`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosTipoContacto(): Observable<ResultadoTipoCanalContacto> {
    let url = `${this.url_base}/obtenerTodosTipoContacto`;
    return this.http.get<ResultadoTipoCanalContacto>(url);
  }

  agregarTipoContacto(data: TipoCanalContacto): Observable<ResultadoAccionTipoCanalContacto> {
    let url = `${this.url_base}/agregarTipoContacto`;
    return this.http.post<ResultadoAccionTipoCanalContacto>(url, data);
  }

  editarTipoContacto(data: TipoCanalContacto): Observable<ResultadoAccionTipoCanalContacto> {
    let url = `${this.url_base}/editarTipoContacto`;
    return this.http.put<ResultadoAccionTipoCanalContacto>(url, data);
  }

  cambiarEstadoCanalContacto(data: TipoCanalContacto): Observable<ResultadoAccionTipoCanalContacto> {
    let url = `${this.url_base}/modificarEstadoTipoContacto`;
    return this.http.put<ResultadoAccionTipoCanalContacto>(url, data);
  }
}