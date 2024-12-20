import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Payload } from '../interfaces/auth';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class InversionistaAdminGuard implements CanActivate {

  constructor(
    private sAuth: AuthService,
    private router: Router
  ) { }

  canActivate(route: any): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const decoded = jwtDecode<Payload>(this.sAuth.getToken()!);
    const perfilPermitido = route.data.perfil;

    if(perfilPermitido.includes(decoded.perfil)){
      this.router.navigate(['inversionista', 'admin'])
      return false;
    }

    return true;
  }
  
}
