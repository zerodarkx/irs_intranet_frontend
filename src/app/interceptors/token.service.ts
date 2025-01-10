import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  private isRefreshing = false; // Evita múltiples solicitudes de renovación simultáneamente
  private excludedUrls: string[] = ['/auth/login', '/auth/recuperarPassword', '/formularios']

  constructor(
    private router: Router,
    private sAuth: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isExcluded = this.excludedUrls.some(url => req.url.includes(url));
    if (isExcluded) return next.handle(req);

    const token = localStorage.getItem('token');
    if (!token) this.router.navigate(['/auth/login']);

    if (token && this.isTokenNearExpiry(token)) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        return this.sAuth.renovarToken().pipe(
          switchMap((response) => {
            // Guardar el nuevo token
            localStorage.setItem('token', response.token);
            this.isRefreshing = false;

            // Reintentar la solicitud original con el nuevo token
            const clonedRequest = this.addTokenHeader(req, token!);
            return next.handle(clonedRequest);
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.router.navigate(['/auth/login']);
            return throwError(() => error);
          })
        );
      }
    }

    // Si no es necesario renovar, continuar con la solicitud normal
    const clonedRequest = this.addTokenHeader(req, token!);
    return next.handle(clonedRequest);
  }

  private addTokenHeader(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Método para verificar si el token ha expirado y pedir uno nuevo
  private isTokenNearExpiry(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const timeLeft = decoded.exp - currentTime;
      return timeLeft < 1800; // Menos de 30 minutos
    } catch (error) {
      console.log(error);
      return true;
    }
  }
}
