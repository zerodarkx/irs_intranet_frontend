export interface ITipoDocumento{
    id_tipoDocumento:     number;
    nombre_tipoDocumento: string;
}

export interface ResultadoTipoDocumentos {
    ok:   boolean;
    data: ITipoDocumento[];
}

export interface ResultadoAccionesTipoDocumento{
    ok: boolean;
    data: AccionesTipoTipoDocumento
}

export interface AccionesTipoTipoDocumento {
    mensaje: string;
    titulo: string;
    icono: string;
}