import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportarPdfService {

  private url_base: string = `${env.apiUrl}/exportarPdf`;

  constructor(
    private http: HttpClient
  ) { }

  exportarSimulacionPdf(id_simulacion: number): Observable<Blob> {
    let url = `${this.url_base}/descargarSimulacion/${id_simulacion}`;
    return this.http.post(url, {}, { responseType: 'blob' });
  }
}
