import { ErrorHttpCustom } from "src/app/interfaces";
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

export async function mostrarConfirmacion(titulo: string, mensaje: string): Promise<boolean> {
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

export function errorConexionServidor(errorHttp: ErrorHttpCustom) {
    Swal.fire({
        icon: IconoSweetAlert.Error,
        title: "Ups hubo un problema",
        html: `Hubo un problema interno favor tomar pantallazo y especificar ID del Caso y enviar a soporte
                <table class="table table-bordered" width="100%">
                    <tr >
                        <td width="25%" class="align-middle">
                            <b>Ruta</b>
                        </td>
                        <td>
                            ${errorHttp.ruta}
                        </td>
                    </tr>
                    <tr>
                        <td class="align-middle">
                            <b>Tipo</b>
                        </td>
                        <td>
                            ${errorHttp.mensaje} - ${errorHttp.codigo}
                        </td>
                    </tr>
                    <tr>
                        <td class="align-middle">
                            <b>Interno</b>
                        </td>
                        <td>
                            ${errorHttp.customMessage}
                        </td>
                    </tr>
                </table>`,
        confirmButtonText: 'Aceptar',
        width: '600px'
    });
}