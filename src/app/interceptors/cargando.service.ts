import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';

import { CargandoService } from '../services';

@Injectable({
  providedIn: 'root'
})
export class CargandoInterceptorService {

  constructor(private cargandoService: CargandoService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.cargandoService.show();
    return next.handle(req).pipe(
      finalize(() => this.cargandoService.hide())
    );
  }
}
