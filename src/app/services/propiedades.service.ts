import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { env } from 'src/environments/environment';

import { ResultadoObtenerCaracteristicasPropiedad, ResultadoPropiedades } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class PropiedadesService {

  private idPropiedad = new BehaviorSubject<string | null>(null);
  currentIdPropiedad = this.idPropiedad.asObservable();
  id_propiedad: string | null = '';

  private url_base: string = `${env.apiUrl}/propiedades`;

  constructor(
    private http: HttpClient,
  ) {
    this.currentIdPropiedad.subscribe(id => { return this.id_propiedad = id })
  }

  setIdCliente(idCliente: string) {
    this.idPropiedad.next(idCliente);
  }

  existePropiedadSistema(): Observable<{ ok: boolean }> {
    let url = `${this.url_base}/existePropiedad/${this.id_propiedad}`;
    return this.http.get<{ ok: boolean }>(url);
  }

  obtenerPropiedadesPorFiltro(filtro: any): Observable<ResultadoPropiedades> {
    let url = `${this.url_base}/obtenerTodasLasPropiedades`;
    return this.http.post<ResultadoPropiedades>(url, filtro);
  }

  obtenerPropiedadesPorId(id_propiedad: string): Observable<any> {
    let url = `${this.url_base}/obtenerPropiedadesPorId/${id_propiedad}`;
    return this.http.get<any>(url);
  }

  obtenerCaracteristicasPropiedad(id_propiedad: string): Observable<ResultadoObtenerCaracteristicasPropiedad> {
    let url = `${this.url_base}/obtenerCaracteristicasPropiedad/${id_propiedad}`;
    return this.http.get<ResultadoObtenerCaracteristicasPropiedad>(url);
  }
}
