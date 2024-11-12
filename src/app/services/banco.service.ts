import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from "../../environments/environment.development";

import { ResultadoTodosBancos } from '../interfaces/bancos';

@Injectable({
  providedIn: 'root'
})
export class BancoService {

  private url_base: string = `${env.apiUrl}/bancos`;

  constructor(
    private http: HttpClient
  ) { }

  obtenerTodosBancos(): Observable<ResultadoTodosBancos> {
    let url = `${this.url_base}/getBancos`;
    return this.http.get<ResultadoTodosBancos>(url);
  }
}
