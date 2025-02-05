import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportarExcelService {

  private url_base: string = `${env.apiUrl}/exportarExcel`;

  constructor(
    private http: HttpClient
  ) { }

  exportarCliente(data: any): Observable<Blob> {
    let url = `${this.url_base}/exportarClientes`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

  exportarCasosInversionistas(data: any): Observable<Blob>{
    let url = `${this.url_base}/exportarCasosInversionistas`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

  exportarComentariosInversionistas(data: any): Observable<Blob>{
    let url = `${this.url_base}/exportarCasosInversionistas`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

  exportarCasosSalidas(data: any): Observable<Blob>{
    let url = `${this.url_base}/exportarCasosSalidas`;
    return this.http.post(url, data, { responseType: 'blob' });
  }

}
