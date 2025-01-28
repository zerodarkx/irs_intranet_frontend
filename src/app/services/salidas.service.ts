import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { ResultadoObtenerClienteDetalle, ResultadoObtenerClientesSalida } from '../interfaces';

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
}

