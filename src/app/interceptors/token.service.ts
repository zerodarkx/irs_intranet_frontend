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
  private excludedUrls: string[] = ['/auth']

  constructor(
    private router: Router,
    private sAuth: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const isExcluded = this.excludedUrls.some(url => req.url.includes(url));
    if (isExcluded) return next.handle(req);

    const token = localStorage.getItem('token');

    if (token && this.isTokenNearExpiry(token)) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        return this.sAuth.renovarToken().pipe(
          switchMap((response) => {
            // Guardar el nuevo token
            localStorage.setItem('token', response.token);
            this.isRefreshing = false;

            // Reintentar la solicitud original con el nuevo token
            const clonedRequest = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.token}`,
              },
            });
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

    if (!token) {
      this.router.navigate(['/auth/login']);
    }

    // Si no es necesario renovar, continuar con la solicitud normal
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next.handle(clonedRequest);
  }

  // Método para verificar si el token ha expirado y pedir uno nuevo
  private isTokenNearExpiry(token: string): boolean {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeLeft = decoded.exp - currentTime;
    return timeLeft < 300; // Menos de 5 minutos
  }
}
