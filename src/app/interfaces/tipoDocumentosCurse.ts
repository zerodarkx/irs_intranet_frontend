export interface TipoDocumentoCurse{
    id_tipoDocumento:     number;
    nombre_tipoDocumento: string;
}

export interface ResultadoTipoDocumentosCurse {
    ok:   boolean;
    data: TipoDocumentoCurse[];
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