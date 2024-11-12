import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment.development';
import { ResultadoObtenerTodasLineasNegocio } from '../interfaces/lineaNegocio';

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
}
