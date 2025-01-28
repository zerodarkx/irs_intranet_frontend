import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TipoSalidasService {

  private url_base: string = `${env.apiUrl}/tipoSalidas`;
  constructor(
    private http: HttpClient,
  ) { }

  obtenerTodosTipoSalidas(): Observable<any>{
    let url = `${this.url_base}/obtenerTodosTipoSalidas`;
    return this.http.get<any>(url);
  }

  obtenerTodosTipoSubSalidas(): Observable<any>{
    let url = `${this.url_base}/obtenerTodosTipoSubSalidas`;
    return this.http.get<any>(url);
  }
}
