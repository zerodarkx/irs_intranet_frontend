export interface ResultadoTipoGestion {
    ok:   boolean;
    data: TipoGestion[];
}

export interface TipoGestion {
    id_tipoGestion:     number;
    nombre_tipoGestion: string;
}