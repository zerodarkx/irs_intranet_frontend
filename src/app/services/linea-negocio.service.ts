import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { LineaNegocio, ResultadoAccionesLineaNegocio, ResultadoObtenerTodasLineasNegocio } from '../interfaces/lineaNegocio';

@Injectable({
  providedIn: 'root'
})
export class LineaNegocioService {

  private url_base: string = `${env.apiUrl}/lineaNegocio`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodasLasLineasNegocio(): Observable<ResultadoObtenerTodasLineasNegocio> {
    let url = `${this.url_base}/obtenerTodasLasLineasNegocio`;
    return this.http.get<ResultadoObtenerTodasLineasNegocio>(url);
  }

  agregarLineaNegocio(data: LineaNegocio): Observable<ResultadoAccionesLineaNegocio> {
    let url = `${this.url_base}/agregarLineaNegocio`;
    return this.http.post<ResultadoAccionesLineaNegocio>(url, data);
  }

  editarLineaNegocio(data: LineaNegocio): Observable<ResultadoAccionesLineaNegocio> {
    let url = `${this.url_base}/editarLineaNegocio`;
    return this.http.put<ResultadoAccionesLineaNegocio>(url, data);
  }
}
