import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

import { Payload } from '../interfaces';
import { AuthService } from '../services';

import { jwtDecode } from 'jwt-decode';
import { IconoSweetAlert, mostrarMensaje } from '../shared/utils/sweetAlert';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {

  constructor(
    private sAuth: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.sAuth.isLoggedIn()) {
      this.handleLogout();
      return false;
    }

    const token = this.sAuth.getToken();
    if (!token) {
      this.handleLogout();
      return false;
    }
    
    try {
      const decoded = jwtDecode<Payload>(token);
      const currentTime = Date.now() / 1000; // Obtener el tiempo actual en segundos

      // Comparar la fecha de expiración con la hora actual
      if (decoded.exp < currentTime) {
        this.handleLogout();
        return false;
      } else {
        return new Observable<boolean>(observer => {
          this.sAuth.verificarToken().subscribe({
            next: (response) => {
              if (!response) {
                this.handleLogout();
                observer.next(false);
              } else {
                observer.next(true);
              }
              observer.complete();
            },
            error: () => {
              this.handleLogout();
              observer.next(false);
              observer.complete();
            }
          });
        });
      }
    } catch (error) {
      this.handleLogout();
      return false;
    }
  }

  private handleLogout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/auth']);
    mostrarMensaje({
      icono: IconoSweetAlert.Warning,
      titulo: 'Sesión expirada',
      mensaje: 'Su sesión ha expirado, por favor inicie sesión nuevamente'
    });
  }

}
