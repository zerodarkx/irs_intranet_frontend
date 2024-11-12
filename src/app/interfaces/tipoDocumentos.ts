export interface ITipoDocumento{
    id_tipoDocumento:     number;
    nombre_tipoDocumento: string;
}

export interface ResultadoTipoDocumentos {
    ok:   boolean;
    data: ITipoDocumento[];
}
