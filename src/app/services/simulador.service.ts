import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment.development';
import { ISimulador, ResultadoCrearSimulacion, ResultadoObtenerSimulacionPorCliente, ResultadoObtenerTodasSimulacionPorCliente } from '../interfaces/simulador';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class SimuladorService {

  private url_base: string = `${env.apiUrl}/simulador`;
  id_cliente: any;

  constructor(
    private http: HttpClient,
    private sCliente: ClienteService
  ) { 
    this.sCliente.currentIdCliente.subscribe(id => { return this.id_cliente = id })
  }

  crearNuevaSimulacion(data: ISimulador): Observable<ResultadoCrearSimulacion> {
    data.id_cliente = this.id_cliente
    let url = `${this.url_base}/crearSimulacion`;
    return this.http.post<ResultadoCrearSimulacion>(url, data);
  }

  obtenerTodasSimulacionPorCliente(): Observable<ResultadoObtenerTodasSimulacionPorCliente>{
    let url = `${this.url_base}/obtenerSImulacionByCliente/${this.id_cliente}`;
    return this.http.get<ResultadoObtenerTodasSimulacionPorCliente>(url);
  }

  obtenerSimulacionPorIdCliente(): Observable<ResultadoObtenerSimulacionPorCliente>{
    let url = `${this.url_base}/obtenerSimulacionByIdCliente/${this.id_cliente}`;
    return this.http.get<ResultadoObtenerSimulacionPorCliente>(url);
  }
}
