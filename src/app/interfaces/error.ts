import { HttpErrorResponse } from "@angular/common/http";

export interface ErrorHttpCustom {
    ruta: string;
    mensaje: string;
    customMessage: string;
    codigo: number;
}