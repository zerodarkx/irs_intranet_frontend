import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { ResultadoCrearEditarEliminarBitacora, ResultadoObtenerClienteDetalle, ResultadoObtenerClientesSalida, ResultadoObtenerTodasBitacoras } from '../interfaces';

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

  modificarClienteSalidaDetalle(data: any): Observable<{ ok: boolean, mensaje: string }> {
    let url = `${this.url_base}/modificarClienteSalidaDetalle/${this.id_cliente}`;
    return this.http.put<{ ok: boolean, mensaje: string }>(url, data);
  }
}

