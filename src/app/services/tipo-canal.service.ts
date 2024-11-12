import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ResultadoComisionTasaByID, ResultadoTipoClientesTodos } from '../interfaces/tipoCanales';
import { env } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoCanalService {

  private url_base: string = `${env.apiUrl}/tipoCanales`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosTipoCanales(): Observable<ResultadoTipoClientesTodos> {
    let url = `${this.url_base}/getTipoCanales`;
    return this.http.get<ResultadoTipoClientesTodos>(url);
  }

  obtenerComisionRentaById(id: number): Observable<ResultadoComisionTasaByID> {
    let url = `${this.url_base}/getComisionRentaById/${id}`;
    return this.http.get<ResultadoComisionTasaByID>(url);
  }

  obtenerTodosBancos(): Observable<any> {
    let url = `${this.url_base}/getComisionRentaById`;
    return this.http.get<ResultadoComisionTasaByID>(url);
  }
}
