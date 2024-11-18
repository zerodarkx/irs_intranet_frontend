import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { Comuna, ResultadoObtenerComunas } from '../interfaces/comuna';

@Injectable({
  providedIn: 'root'
})
export class ComunaService {

  private url_base: string = `${env.apiUrl}/comuna`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerComunasPorRegion(id_region: number): Observable<ResultadoObtenerComunas> {
    let url = `${this.url_base}/obtenerComunaPorRegion/${id_region}`;
    return this.http.get<ResultadoObtenerComunas>(url);
  }
}
