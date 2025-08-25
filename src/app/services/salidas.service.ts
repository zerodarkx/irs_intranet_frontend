import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { env } from 'src/environments/environment';

import { exportarPdf, Prorroga, ResponseExportarPDF, ResultadoAgregarProrroga, ResultadoCrearEditarEliminarBitacora, ResultadoObtenerClienteDetalle, ResultadoObtenerClientesSalida, ResultadoObtenerProrroga, ResultadoObtenerTodasBitacoras } from '../interfaces';
import { ResultadoGestionSalidas } from '../interfaces/gestionesSalidas';

@Injectable({
  providedIn: 'root'
})
export class SalidasService {
  private idClienteSource = new BehaviorSubject<string | null>(null);
  currentIdCliente = this.idClienteSource.asObservable();
  id_cliente: string | null = '';

  private url_base: string = `${env.apiUrl}/salidas`;
  constructor(
    private http: HttpClient,
  ) {
    this.currentIdCliente.subscribe(id => { return this.id_cliente = id });
  }

  setIdCliente(idCliente: string) {
    this.idClienteSource.next(idCliente);
  }

  existeClienteSistema(): Observable<{ ok: boolean }> {
    let url = `${this.url_base}/existeCliente/${this.id_cliente}`;
    return this.http.get<{ ok: boolean }>(url);
  }

  obtenerClienteSalidaDetalle(): Observable<ResultadoObtenerClienteDetalle> {
    let url = `${this.url_base}/obtenerClienteSalidaDetalle/${this.id_cliente}`;
    return this.http.get<ResultadoObtenerClienteDetalle>(url);
  }

  obtenerTodosClienteSalida(filtro: any): Observable<ResultadoObtenerClientesSalida> {
    let url = `${this.url_base}/obtenerTodosClienteSalida`;
    return this.http.post<ResultadoObtenerClientesSalida>(url, filtro);
  }

  modificarClienteSalidaDetalle(data: any): Observable<{ ok: boolean, mensaje: string }> {
    let url = `${this.url_base}/modificarClienteSalidaDetalle/${this.id_cliente}`;
    return this.http.put<{ ok: boolean, mensaje: string }>(url, data);
  }

  // BITACORA
  obtenerBitacorasPorCliente(): Observable<ResultadoObtenerTodasBitacoras> {
    let url = `${this.url_base}/obtenerBitacorasSalidasPorCliente/${this.id_cliente}`;
    return this.http.get<ResultadoObtenerTodasBitacoras>(url);
  }

  crearBitacoraPorCliente(data: any): Observable<ResultadoCrearEditarEliminarBitacora> {
    let url = `${this.url_base}/crearBitacorasSalidasPorCliente/${this.id_cliente}`;
    return this.http.post<ResultadoCrearEditarEliminarBitacora>(url, data);
  }

  editarBitacoraPorCliente(data: any): Observable<ResultadoCrearEditarEliminarBitacora> {
    let url = `${this.url_base}/modificarBitacorasSalidasPorCliente`;
    return this.http.put<ResultadoCrearEditarEliminarBitacora>(url, data);
  }

  eliminarBitacoraPorCliente(id_bitacora: number): Observable<ResultadoCrearEditarEliminarBitacora> {
    let url = `${this.url_base}/eliminarBitacorasSalidasPorCliente/${id_bitacora}`;
    return this.http.delete<ResultadoCrearEditarEliminarBitacora>(url);
  }

  // PRORROGAS
  obtenerProrrogaPorCliente(): Observable<ResultadoObtenerProrroga> {
    let url = `${this.url_base}/obtenerProrrogaPorCliente/${this.id_cliente}`;
    return this.http.get<ResultadoObtenerProrroga>(url);
  }

  agregarProrrogaPorCliente(data: any): Observable<ResultadoAgregarProrroga> {
    let url = `${this.url_base}/agregarProrrogaPorCliente/${this.id_cliente}`;
    return this.http.post<ResultadoAgregarProrroga>(url, data);
  }

  aceptarProrrogaPorCliente(id_prorroga: number): Observable<{ ok: boolean, mensaje: string }> {
    let url = `${this.url_base}/cambiarEstadoProrrogaPorCliente/${id_prorroga}`;
    return this.http.put<{ ok: boolean, mensaje: string }>(url, {});
  }

  modificarProrrogaPorCliente(data: Prorroga): Observable<{ ok: boolean, mensaje: string }> {
    let url = `${this.url_base}/modificarProrrogaPorCliente`;
    return this.http.put<{ ok: boolean, mensaje: string }>(url, data);
  }

  eliminarProrrogaPorCliente(id_prorroga: number): Observable<{ ok: boolean, mensaje: string }> {
    let url = `${this.url_base}/eliminarProrrogaPorCliente/${id_prorroga}`;
    return this.http.delete<{ ok: boolean, mensaje: string }>(url);
  }

  exportarFichaDetalleProrroga(id_prorroga: number, tipo: string): Observable<ResponseExportarPDF> {
    let url = `${this.url_base}/exportarFichaDetalleProrroga/${id_prorroga}/${tipo}`;
    return this.http.get<ResponseExportarPDF>(url);
  }

  // GESTIONES
  obtenerGestionSalidaPorCliente(): Observable<ResultadoGestionSalidas> {
    let url = `${this.url_base}/obtenerGestionSalidaPorCliente/${this.id_cliente}`;
    return this.http.get<ResultadoGestionSalidas>(url);
  }

  agregarGestionPorCliente(data: any): Observable<any> {
    let url = `${this.url_base}/agregarGestionPorCliente/${this.id_cliente}`;
    return this.http.post<any>(url, data);
  }
}

