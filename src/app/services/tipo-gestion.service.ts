import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { ResultadoTipoGestion } from '../interfaces/tipoGestion';

@Injectable({
  providedIn: 'root'
})
export class TipoGestionService {

  private url_base: string = `${env.apiUrl}/tipoGestion`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTipoGestion(): Observable<ResultadoTipoGestion>{
    let url = `${this.url_base}/obtenerTipoGestion`;
    return this.http.get<ResultadoTipoGestion>(url);
  }
}
