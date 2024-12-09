import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { ResultadoAgregarCasoNuevoReserva, ResultadoObtenerDataInversionista, ResultadoObtenerTodosInversionesContador, ResultadoObtenerTodosInversionesPorEstado } from '../interfaces/inversionista';

@Injectable({
  providedIn: 'root'
})
export class InversionistasService {

  private url_base: string = `${env.apiUrl}/inversionista`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosInversionistaContador(): Observable<ResultadoObtenerTodosInversionesContador>{
    let url = `${this.url_base}/obtenerTodosInversionesContador/`;
    return this.http.get<ResultadoObtenerTodosInversionesContador>(url);
  }
  obtenerTodosInversionesPorEstado(estado: number): Observable<ResultadoObtenerTodosInversionesPorEstado>{
    let url = `${this.url_base}/obtenerTodosInversionesPorEstado/${estado}`;
    return this.http.get<ResultadoObtenerTodosInversionesPorEstado>(url);
  }
  obtenerTodosInversionesDisponibles(): Observable<ResultadoObtenerTodosInversionesPorEstado>{
    let url = `${this.url_base}/obtenerTodosInversionesPorEstadoDisponibles`;
    return this.http.get<ResultadoObtenerTodosInversionesPorEstado>(url);
  }
  obtenerDataInverionista(id_inv: number): Observable<ResultadoObtenerDataInversionista>{
    let url = `${this.url_base}/obtenerDatosInversionista/${id_inv}`;
    return this.http.get<ResultadoObtenerDataInversionista>(url);
  }
  agregarCasoNuevoReserva(data: any): Observable<ResultadoAgregarCasoNuevoReserva>{
    let url = `${this.url_base}/agregarCasoNuevoReserva`;
    return this.http.post<ResultadoAgregarCasoNuevoReserva>(url, data);
  }
  cambiarDeEstadoDeReserva(data: any): Observable<ResultadoAgregarCasoNuevoReserva>{
    let url = `${this.url_base}/cambiarDeEstadoDeReserva`;
    return this.http.put<ResultadoAgregarCasoNuevoReserva>(url, data);
  }
}
