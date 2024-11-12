import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment.development';
import { ResultadoObtenerTodasRegiones } from '../interfaces/regiones';

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  private url_base: string = `${env.apiUrl}/region`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodasLasRegiones(): Observable<ResultadoObtenerTodasRegiones> {
    let url = `${this.url_base}/obtenerTodasLasRegiones`;
    return this.http.get<ResultadoObtenerTodasRegiones>(url);
  }
}
