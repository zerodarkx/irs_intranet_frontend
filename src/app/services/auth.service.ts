import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FormularioLogin, ResultadoAuthLogin, ValidarSession } from '../interfaces/auth';
import { Router } from '@angular/router';
import { env } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url_base: string = `${env.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  // Método para comprobar si el usuario está autenticado
  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true si el token existe
  }

  // Método para obtener el token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  cerrarSession() {
    localStorage.removeItem('token')
    this.router.navigate(['/auth'])
  }

  verificarToken(): Observable<ValidarSession> {
    let url = `${this.url_base}/verificar`;
    return this.http.get<ResultadoAuthLogin>(url);
  }

  loginCliente(data: FormularioLogin): Observable<ResultadoAuthLogin> {
    let url = `${this.url_base}/login`;
    return this.http.post<ResultadoAuthLogin>(url, data);
  }

  recuperarPassword(correo: string): Observable<any> {
    let url = `${this.url_base}/recuperarPassword`;
    return this.http.post<any>(url, { correo })
  }

  renovarToken(): Observable<{ token: string }> {
    let url = `${this.url_base}/renovarToken`;
    return this.http.post<{ token: string }>(url, {})
  }

  generarTokenTemporal(): Observable<{ token: string }> {
    let url = `${this.url_base}/generarTokenTemporal`;
    return this.http.get<{ token: string }>(url)
  }
}
