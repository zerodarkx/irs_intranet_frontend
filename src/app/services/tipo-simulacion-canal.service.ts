import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ITipoCanales, ResultadoAccionesCanalSimulacion, ResultadoComisionTasaByID, ResultadoCanalesSimulacion } from '../interfaces/tipoSimulacionCanales';
import { env } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TipoSimulacionCanalService {

  private url_base: string = `${env.apiUrl}/tipoSimulacionCanales`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosTipoCanales(): Observable<ResultadoCanalesSimulacion> {
    let url = `${this.url_base}/getTipoCanales`;
    return this.http.get<ResultadoCanalesSimulacion>(url);
  }

  obtenerComisionRentaById(id: number): Observable<ResultadoComisionTasaByID> {
    let url = `${this.url_base}/getComisionRentaById/${id}`;
    return this.http.get<ResultadoComisionTasaByID>(url);
  }

  agregarCanalSimulacion(data: ITipoCanales): Observable<ResultadoAccionesCanalSimulacion> {
    let url = `${this.url_base}/agregarCanalSimulacion`;
    return this.http.post<ResultadoAccionesCanalSimulacion>(url, data);
  }

  editarCanalSimulacion(data: ITipoCanales): Observable<ResultadoAccionesCanalSimulacion> {
    let url = `${this.url_base}/editarCanalSimulacion`;
    return this.http.put<ResultadoAccionesCanalSimulacion>(url, data);
  }

}
