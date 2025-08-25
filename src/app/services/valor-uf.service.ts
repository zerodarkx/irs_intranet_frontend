import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { env } from 'src/environments/environment';
import { ResponseValorUf } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValorUfService {

  private url_base: string = `${env.apiUrl}/valorUF`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerValorUfHoy(): Observable<ResponseValorUf> {
    return this.http.get<ResponseValorUf>(`${this.url_base}/obtenerValorUf`);
  }

  obtenerValorUfFechaEspecifica(fecha: string): Observable<ResponseValorUf> {
    const fechaFormateada = fecha.split('-');
    return this.http.get<ResponseValorUf>(`${this.url_base}/obtenerValorUfFecha/${fechaFormateada[0]}/${fechaFormateada[1]}/${fechaFormateada[2]}`);
  }
}
