export interface ClienteEstados {
    id_estado: number;
    nombre_estado: string;
    det_estado: string;
}

export interface ResultadoClienteEstados {
    ok: boolean;
    data: ClienteEstados[];
}

export interface ResultadoAccionesClienteEstados{
    ok: boolean;
    data: AccionesClienteEstados
}

export interface AccionesClienteEstados {
    mensaje: string;
    titulo: string;
    icono: string;
}