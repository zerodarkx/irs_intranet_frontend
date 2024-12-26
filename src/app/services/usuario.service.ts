import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { ResultadoObtenerEjecutivoYbroker } from '../interfaces/cliente';
import {
  ResultadoAccionesUsuario,
  ResultadoGuardarDataInversionista,
  ResultadoObtenerDataInversionista,
  ResultadoObtenerSelectInversionistaDisponibles,
  ResultadoObtenerTodosUsuario
} from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private url_base: string = `${env.apiUrl}/usuario`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerEjecutivosBrokers(): Observable<ResultadoObtenerEjecutivoYbroker> {
    let url = `${this.url_base}/obtenerEjecutivosYbrokers`;
    return this.http.get<ResultadoObtenerEjecutivoYbroker>(url);
  }

  obtenerTodosUsuario(): Observable<ResultadoObtenerTodosUsuario> {
    let url = `${this.url_base}/obtenerTodosUsuarios`;
    return this.http.get<ResultadoObtenerTodosUsuario>(url);
  }

  agregarNuevoUsuario(data: any): Observable<ResultadoAccionesUsuario> {
    let url = `${this.url_base}/agregarUsuario`;
    return this.http.post<ResultadoAccionesUsuario>(url, data);
  }

  editarUsuario(data: any): Observable<ResultadoAccionesUsuario> {
    let url = `${this.url_base}/modificarUsuario`;
    return this.http.put<ResultadoAccionesUsuario>(url, data);
  }

  modificarPassword(data: any): Observable<ResultadoAccionesUsuario> {
    let url = `${this.url_base}/modificarPasswordUsuario`;
    return this.http.put<ResultadoAccionesUsuario>(url, data);
  }

  cambiarEstadoUsuario(data: any): Observable<ResultadoAccionesUsuario> {
    let url = `${this.url_base}/cambiarEstadoUsuario`;
    return this.http.put<ResultadoAccionesUsuario>(url, data);
  }

  obtenerSelectInversionistaDisponibles(id_cliente: number): Observable<ResultadoObtenerSelectInversionistaDisponibles> {
    let url = `${this.url_base}/obtenerTodosInversionistaDisponibles/${id_cliente}`;
    return this.http.get<ResultadoObtenerSelectInversionistaDisponibles>(url);
  }

  obtenerSelectInversionista(): Observable<ResultadoObtenerSelectInversionistaDisponibles> {
    let url = `${this.url_base}/obtenerTodosInversionista`;
    return this.http.get<ResultadoObtenerSelectInversionistaDisponibles>(url);
  }

  guardarPermisosUsuario(data: any): Observable<any> {
    let url = `${this.url_base}/modificarPermisosUsuario`;
    return this.http.put<any>(url, data);
  }

  obtenerDataInversionista(id_usuario: Number): Observable<ResultadoObtenerDataInversionista> {
    let url = `${this.url_base}/obtenerDataInversionista/${id_usuario}`;
    return this.http.get<ResultadoObtenerDataInversionista>(url);
  }

  guardarDataInversionista(data: any): Observable<ResultadoGuardarDataInversionista> {
    let url = `${this.url_base}/guardarDataInversionista`;
    return this.http.put<ResultadoGuardarDataInversionista>(url, data);
  }

}

