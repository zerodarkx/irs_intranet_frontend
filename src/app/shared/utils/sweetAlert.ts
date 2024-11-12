import { HttpErrorResponse } from "@angular/common/http";
import Swal from "sweetalert2";

interface IMensajeResultado {
    icono: IconoSweetAlert,
    titulo: string,
    mensaje: string
}

export enum IconoSweetAlert {
    Success = 'success',
    Error = 'error',
    Warning = 'warning',
    Info = 'info',
    Question = 'question'
}

export function mostrarMensaje({ icono, titulo, mensaje }: IMensajeResultado) {
    Swal.fire({
        icon: icono,
        title: titulo,
        html: mensaje,
        confirmButtonText: 'Aceptar'
    });
}

export function mostrarConfirmacion(titulo: string, mensaje: string): Promise<boolean> {
    return Swal.fire({
        title: titulo,
        text: mensaje,
        icon: IconoSweetAlert.Warning,
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        return result.isConfirmed; // Devuelve true si el usuario hizo clic en "Sí"
    });
}

export function errorConexionServidor(error: HttpErrorResponse) {
    Swal.fire({
        icon: IconoSweetAlert.Error,
        title: "Ups hubo un problema",
        html: `Hubo un problema interno favor tomar pantallazo y enviar a soporte
                <table class="table table-bordered" width="100%">
                    <tr >
                        <td width="25%" class="align-middle">
                            <b>mensaje:</b>
                        </td>
                        <td>
                            ${error.message}
                        </td>
                    </tr>
                    <tr>
                        <td class="align-middle">
                            <b>nombre:</b>
                        </td>
                        <td>
                            ${error.name}
                        </td>
                    </tr>
                    <tr>
                        <td class="align-middle">
                            <b>nombre:</b>
                        </td>
                        <td>
                            ${error.error.error}
                        </td>
                    </tr>
                </table>`,
        confirmButtonText: 'Aceptar',
        width: '600px'
    });
}