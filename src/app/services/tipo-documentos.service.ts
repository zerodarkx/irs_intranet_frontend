import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResultadoTipoDocumentos } from '../interfaces/tipoDocumentos';
import { env } from 'src/environments/environment.development';

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
}
