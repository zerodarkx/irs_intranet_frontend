import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from 'src/environments/environment';
import { exportarPdf } from '../interfaces/exportar';

@Injectable({
  providedIn: 'root'
})
export class ExportarPdfService {

  private url_base: string = `${env.apiUrl}/exportarPdf`;

  constructor(
    private http: HttpClient
  ) { }

  exportarSimulacionPdf(id_simulacion: number): Observable<exportarPdf> {
    let url = `${this.url_base}/descargarSimulacion/${id_simulacion}`;
    return this.http.post<exportarPdf>(url, {});
  }
  exportarFichaComitePdf(id_cliente: number): Observable<exportarPdf> {
    let url = `${this.url_base}/descargarFichaComite/${id_cliente}`;
    return this.http.post<exportarPdf>(url, {});
  }
  exportarGastosClientePdf(id_cliente: number): Observable<exportarPdf> {
    let url = `${this.url_base}/descargarGastoCliente/${id_cliente}`;
    return this.http.post<exportarPdf>(url, {});
  }
  exportarFichaInversionistaPdf(data: any): Observable<exportarPdf> {
    let url = `${this.url_base}/descargarFcihaInversionista`;
    return this.http.post<exportarPdf>(url, data);
  }
  exportarfichaCierreSimulacionPdf(data: any): Observable<exportarPdf> {
    let url = `${this.url_base}/descargarCierreSimulacion`;
    return this.http.post<exportarPdf>(url, data);
  }
}
