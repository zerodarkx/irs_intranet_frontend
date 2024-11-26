import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ResultadoTipoDocumentosCurse } from '../interfaces/tipoDocumentosCurse';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentosCurseService {

  private url_base: string = `${env.apiUrl}/tipoDocumentosCurse`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosTipoDocumentos(): Observable<ResultadoTipoDocumentosCurse> {
    let url = `${this.url_base}/obtenerDocumentosCurse`;
    return this.http.get<ResultadoTipoDocumentosCurse>(url);
  }
}
