export interface TipoDocumentoCurse{
    id_tipoDocumento:     number;
    nombre_tipoDocumento: string;
}

export interface ResultadoTipoDocumentosCurse {
    ok:   boolean;
    data: TipoDocumentoCurse[];
}

export interface ResultadoAccionesTipoDocumentoCurse{
    ok: boolean;
    data: AccionesTipoTipoDocumentoCurse
}

export interface AccionesTipoTipoDocumentoCurse {
    mensaje: string;
    titulo: string;
    icono: string;
}