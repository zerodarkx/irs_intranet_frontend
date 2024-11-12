import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GestionCliente, ResultadoCambiarEstado, ResultadoCrearCliente, ResultadoGestionCliente, ResultadoObtenerClienteById, ResultadoObtenerTodosClientes, ResultadoObtenerTodosDocumentosCliente, ResultadoObtenerTodosImagenCliente, ResultadoSubirDocumentoImagen } from '../interfaces/cliente';
import { env } from 'src/environments/environment.development';
import { ResultadoObtenerFichaComite } from '../interfaces/fichaComite';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private idClienteSource = new BehaviorSubject<string | null>(null);
  currentIdCliente = this.idClienteSource.asObservable();
  id_cliente: string | null = '';

  private url_base: string = `${env.apiUrl}/cliente`;

  constructor(
    private http: HttpClient,
  ) {
    this.currentIdCliente.subscribe(id => { return this.id_cliente = id })
  }

  setIdCliente(idCliente: string) {
    this.idClienteSource.next(idCliente);
  }

  existeClienteSistema(): Observable<any> {
    let url = `${this.url_base}/existeCliente/${this.id_cliente}`;
    return this.http.get<any>(url);
  }

  agregarDocumentoCliente(data: FormData): Observable<ResultadoSubirDocumentoImagen> {
    let url = `${this.url_base}/${this.id_cliente}/subirDocumentoCliente`;
    return this.http.post<ResultadoSubirDocumentoImagen>(url, data);
  }

  mostrarTodosDocumentosCliente(): Observable<ResultadoObtenerTodosDocumentosCliente> {
    let url = `${this.url_base}/${this.id_cliente}/mostrarTodosDocumentoCliente`;
    return this.http.get<ResultadoObtenerTodosDocumentosCliente>(url);
  }

  eliminarDocumentoCliente(id_documento: number): Observable<ResultadoSubirDocumentoImagen> {
    let url = `${this.url_base}/${this.id_cliente}/eliminarDocumentoCliente/${id_documento}`;
    return this.http.delete<ResultadoSubirDocumentoImagen>(url);
  }

  agregarImagenCliente(data: FormData): Observable<ResultadoSubirDocumentoImagen> {
    let url = `${this.url_base}/${this.id_cliente}/subirImagenCliente`;
    return this.http.post<ResultadoSubirDocumentoImagen>(url, data);
  }

  mostrarTodosImagenesCliente(): Observable<ResultadoObtenerTodosImagenCliente> {
    let url = `${this.url_base}/${this.id_cliente}/mostrarTodosImagenCliente`;
    return this.http.get<ResultadoObtenerTodosImagenCliente>(url);
  }

  eliminarImagenCliente(id_imagen: number): Observable<ResultadoSubirDocumentoImagen> {
    let url = `${this.url_base}/${this.id_cliente}/eliminarImagenCliente/${id_imagen}`;
    return this.http.delete<ResultadoSubirDocumentoImagen>(url);
  }

  crearNuevoCliente(data: ResultadoCrearCliente) {
    let url = `${this.url_base}/crearCliente`;
    return this.http.post<ResultadoCrearCliente>(url, data);
  }

  obtenerClientePorId(): Observable<ResultadoObtenerClienteById> {
    let url = `${this.url_base}/${this.id_cliente}`;
    return this.http.get<ResultadoObtenerClienteById>(url);
  }

  modificarClientePorId(data: any): Observable<ResultadoCrearCliente> {
    let url = `${this.url_base}/modificarCliente/${this.id_cliente}`;
    return this.http.put<ResultadoCrearCliente>(url, data);
  }

  obtenerGestionesClientePorId(): Observable<ResultadoGestionCliente> {
    let url = `${this.url_base}/obtenerGestionesClienteById/${this.id_cliente}`;
    return this.http.get<ResultadoGestionCliente>(url);
  }

  agregarGestionCliente(data: GestionCliente): Observable<any> {
    let url = `${this.url_base}/agregarGestionCliente/${this.id_cliente}`;
    return this.http.post<ResultadoGestionCliente>(url, data);
  }

  obtenerFichaComiteByCliente(): Observable<any> {
    let url = `${this.url_base}/obtenerFichaComitePorIdCliente/${this.id_cliente}`;
    return this.http.get<any>(url)
  }

  guardarFichaComite(data: FormData): Observable<ResultadoObtenerFichaComite> {
    let url = `${this.url_base}/guardarFichaComite`;
    return this.http.post<ResultadoObtenerFichaComite>(url, data)
  }

  obtenerClientesPorFiltro(data: any): Observable<ResultadoObtenerTodosClientes> {
    let url = `${this.url_base}/obtenerClientesFiltro`;
    return this.http.post<ResultadoObtenerTodosClientes>(url, data)
  }

  cambiarSiguienteEstado():Observable<ResultadoCambiarEstado> {
    let url = `${this.url_base}/cambiarEstado/${this.id_cliente}`;
    return this.http.post<ResultadoCambiarEstado>(url, null);
  }

}