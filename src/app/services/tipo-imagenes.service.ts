import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResultadoTipoImagenes } from '../interfaces/tipoImagenes';
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
}
