import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITipoDocumento, ResultadoAccionesTipoDocumento, ResultadoTipoDocumentos } from '../interfaces/tipoDocumentos';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoDocuentosService {

  private url_base: string = `${env.apiUrl}/tipoDocumentos`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosTipoDocumentos(): Observable<ResultadoTipoDocumentos> {
    let url = `${this.url_base}/getTiposDocumentos`;
    return this.http.get<ResultadoTipoDocumentos>(url);
  }

  agregarTipoDocumento(data: ITipoDocumento): Observable<ResultadoAccionesTipoDocumento> {
    let url = `${this.url_base}/agregarTiposImagen`;
    return this.http.post<ResultadoAccionesTipoDocumento>(url, data);
  }

  editarTipoDocumento(data: ITipoDocumento): Observable<ResultadoAccionesTipoDocumento> {
    let url = `${this.url_base}/editarTiposImagen`;
    return this.http.put<ResultadoAccionesTipoDocumento>(url, data);
  }

  obtenerTodosTipoDocumentosPorLineaNegocio(id_cliente: string): Observable<ResultadoTipoDocumentos> {
    let url = `${this.url_base}/obtenerTodosTipoDocumentosPorLineaNegocio/${id_cliente}`;
    return this.http.get<ResultadoTipoDocumentos>(url);
  }
}
