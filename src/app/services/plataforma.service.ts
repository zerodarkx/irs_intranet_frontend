import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment.development';
import { ResultadoObtenerTodasPlataformas } from '../interfaces/plataforma';

@Injectable({
  providedIn: 'root'
})
export class PlataformaService {

  private url_base: string = `${env.apiUrl}/plataforma`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodasLasPlataformas(): Observable<ResultadoObtenerTodasPlataformas> {
    let url = `${this.url_base}/obtenerTodasLasPlataformas`;
    return this.http.get<ResultadoObtenerTodasPlataformas>(url);
  }
}
