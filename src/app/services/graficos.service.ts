import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { ResultadoObtenerGraficosEjecutivo, ResultadoObtenerGraficosInversionista } from '../interfaces/graficos';

@Injectable({
  providedIn: 'root'
})
export class GraficosService {

  private url_base: string = `${env.apiUrl}/graficos`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerGraficosAdmin(): Observable<ResultadoObtenerGraficosEjecutivo> {
    let url = `${this.url_base}/obtenerGraficosAdmin`;
    return this.http.get<ResultadoObtenerGraficosEjecutivo>(url);
  }
  obtenerGraficosEjecutivo(): Observable<ResultadoObtenerGraficosEjecutivo> {
    let url = `${this.url_base}/obtenerGraficosEjecutivo`;
    return this.http.get<ResultadoObtenerGraficosEjecutivo>(url);
  }
  obtenerGraficosInversionista(): Observable<ResultadoObtenerGraficosInversionista> {
    let url = `${this.url_base}/obtenerGraficosInversionista`;
    return this.http.get<ResultadoObtenerGraficosInversionista>(url);
  }
  obtenerGraficosInversionistaAdmin(): Observable<ResultadoObtenerGraficosInversionista> {
    let url = `${this.url_base}/obtenerGraficosInversionistaAdmin`;
    return this.http.get<ResultadoObtenerGraficosInversionista>(url);
  }
}
