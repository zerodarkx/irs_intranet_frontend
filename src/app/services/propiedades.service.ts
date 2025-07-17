import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { env } from 'src/environments/environment';

import {
  ResultadoPropiedadDocumentoAgregarEliminar,
  ResultadoObtenerCaracteristicasPropiedad,
  ResultadoObtenerDocumentosPropiedad,
  ResultadoPropiedades,
  ResultadoObtenerBitacoraPropiedad,
  ResultadoPropiedadBitacoraAgregarEliminar,
  ResultadoPropiedad,
  ResultadoCambiarEstadoPropiedad
} from '../interfaces';

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

  setIdPropiedad(idPropiedad: string) {
    this.idPropiedad.next(idPropiedad);
  }

  existePropiedadSistema(): Observable<{ ok: boolean }> {
    let url = `${this.url_base}/existePropiedad/${this.id_propiedad}`;
    return this.http.get<{ ok: boolean }>(url);
  }

  obtenerPropiedadesPorFiltro(filtro: any): Observable<ResultadoPropiedades> {
    let url = `${this.url_base}/obtenerTodasLasPropiedades`;
    return this.http.post<ResultadoPropiedades>(url, filtro);
  }

  obtenerPropiedadesPorId(): Observable<ResultadoPropiedad> {
    let url = `${this.url_base}/obtenerPropiedadesPorId/${this.id_propiedad}`;
    return this.http.get<ResultadoPropiedad>(url);
  }

  obtenerCaracteristicasPropiedad(id_propiedad: string): Observable<ResultadoObtenerCaracteristicasPropiedad> {
    let url = `${this.url_base}/obtenerCaracteristicasPropiedad/${id_propiedad}`;
    return this.http.get<ResultadoObtenerCaracteristicasPropiedad>(url);
  }

  // DOCUMENTOS PROPIEDAD
  obtenerDocumentosPropiedad(): Observable<ResultadoObtenerDocumentosPropiedad> {
    let url = `${this.url_base}/obtenerDocumentosPropiedad/${this.id_propiedad}`;
    return this.http.get<ResultadoObtenerDocumentosPropiedad>(url);
  }

  agregarDocumentoPropiedad(formData: FormData): Observable<ResultadoPropiedadDocumentoAgregarEliminar> {
    let url = `${this.url_base}/subirDocumentoPropiedad/${this.id_propiedad}`;
    return this.http.post<ResultadoPropiedadDocumentoAgregarEliminar>(url, formData);
  }

  eliminarDocumentoPropiedad(id_documento: number): Observable<ResultadoPropiedadDocumentoAgregarEliminar> {
    let url = `${this.url_base}/eliminarDocumentoPropiedad/${this.id_propiedad}/${id_documento}`;
    return this.http.delete<ResultadoPropiedadDocumentoAgregarEliminar>(url);
  }

  // BITACORA PROPIEDAD
  obtenerBitacoraPropiedad(): Observable<ResultadoObtenerBitacoraPropiedad> {
    let url = `${this.url_base}/obtenerBitacorasPropiedad/${this.id_propiedad}`;
    return this.http.get<ResultadoObtenerBitacoraPropiedad>(url);
  }

  agregaBitacoraPropiedad(data: any): Observable<ResultadoPropiedadBitacoraAgregarEliminar> {
    let url = `${this.url_base}/agregarBitacoraPropiedad/${this.id_propiedad}`;
    return this.http.post<ResultadoPropiedadBitacoraAgregarEliminar>(url, data);
  }

  eliminarBitacoraPropiedad(id_bitacora: number): Observable<ResultadoPropiedadBitacoraAgregarEliminar> {
    let url = `${this.url_base}/eliminarBitacoraPropiedad/${id_bitacora}`;
    return this.http.delete<ResultadoPropiedadBitacoraAgregarEliminar>(url);
  }

  //CAMBIAR DE ESTADO PROPIEDAD
  cambiarEstadoPropiedad(t_estado: number): Observable<ResultadoCambiarEstadoPropiedad> {
    let url = `${this.url_base}/cambiarEstadoPropiedad/${this.id_propiedad}`;
    return this.http.put<ResultadoCambiarEstadoPropiedad>(url, { estado: t_estado });
  }

}

