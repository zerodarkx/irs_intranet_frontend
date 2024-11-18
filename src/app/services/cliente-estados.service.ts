import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'src/environments/environment';
import { ResultadoAccionesClienteEstados, ResultadoClienteEstados } from '../interfaces/clienteEstados';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteEstadosService {

  private url_base: string = `${env.apiUrl}/clienteEstado`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosTipoCanales(): Observable<ResultadoClienteEstados> {
    let url = `${this.url_base}/obtenerTodosEstadoCliente`;
    return this.http.get<ResultadoClienteEstados>(url);
  }
  
}
