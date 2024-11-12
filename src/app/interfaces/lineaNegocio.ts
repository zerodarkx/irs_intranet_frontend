export interface ResultadoObtenerTodasLineasNegocio {
    ok:   boolean;
    data: LineaNegocio[];
}

export interface LineaNegocio {
    id_lineaNegocio:       number;
    nombre_lineaNegocio: string;
    documentos:          string;
}