export interface ResultadoObtenerTodasLineasNegocio {
    ok:   boolean;
    data: LineaNegocio[];
}

export interface LineaNegocio {
    id_lineaNegocio:       number;
    nombre_lineaNegocio: string;
    documentos:          string;
}

export interface ResultadoAccionesLineaNegocio{
    ok: boolean;
    data: AccionesLineaNegocio
}

export interface AccionesLineaNegocio {
    mensaje: string;
    titulo: string;
    icono: string;
}