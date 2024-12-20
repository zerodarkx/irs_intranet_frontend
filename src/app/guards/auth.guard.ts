import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
import { Payload } from '../interfaces/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private sAuth: AuthService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.sAuth.isLoggedIn()) {

      const decoded = jwtDecode<Payload>(this.sAuth.getToken()!);
      const currentTime = Date.now() / 1000; // Obtener el tiempo actual en segundos

      // Comparar la fecha de expiración con la hora actual
      if (decoded.exp < currentTime) {
        localStorage.removeItem('token');
        this.router.navigate(['/auth']);
      } else {
        this.sAuth.verificarToken()
          .subscribe({
            next: (response) => {
              if (!response) {
                this.router.navigate(['/auth']);
              }
            },
            error: (error: HttpErrorResponse) => { 
              this.router.navigate(['/auth']);
            }
          })
      }
      return true;
    } else {
      // Si el usuario no está autenticado, redirigir a la página de login
      localStorage.removeItem('token');
      this.router.navigate(['/auth']);
      return false;
    }
  }

}
