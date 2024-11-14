import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITipoImagen, ResultadoAccionesTipoImagenes, ResultadoTipoImagenes } from '../interfaces/tipoImagenes';
import { env } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoImagenesService {

  private url_base: string = `${env.apiUrl}/tipoImagenes`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosTipoImagenes(): Observable<ResultadoTipoImagenes> {
    let url = `${this.url_base}/getTiposImagenes`;
    return this.http.get<ResultadoTipoImagenes>(url);
  }

  agregarTipoImagen(data: ITipoImagen): Observable<ResultadoAccionesTipoImagenes> {
    let url = `${this.url_base}/agregarTiposImagen`;
    return this.http.post<ResultadoAccionesTipoImagenes>(url, data);
  }

  editarTipoImagen(data: ITipoImagen): Observable<ResultadoAccionesTipoImagenes> {
    let url = `${this.url_base}/editarTiposImagen`;
    return this.http.put<ResultadoAccionesTipoImagenes>(url, data);
  }
}
