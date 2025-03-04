import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorHttpCustom } from '../interfaces';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let customMessage = 'Ocurrió un error inesperado';
        console.log(error);
        

        // Extraer los mensajes personalizados del backend si existen
        if (error.error) {
          customMessage = error.error.customMensaje || error.error.error || customMessage;
        }

        const customError: ErrorHttpCustom = {
          ruta: req.url,
          mensaje: error.statusText,
          customMessage,
          codigo: error.status
        };
        return throwError(() => customError);
      })
    );
  }
}
