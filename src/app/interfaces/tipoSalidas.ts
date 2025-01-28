export interface ResultadoObtenerTodosTipoSalida {
    ok:   boolean;
    data: TipoSalidas[];
}

export interface TipoSalidas {
    id_tipoSalida: number;
    nombre_salida: string;
}

export interface ResultadoObtenerTodosTipoSubSalida {
    ok:   boolean;
    data: TipoSubSalidas[];
}

export interface TipoSubSalidas {
    id_tipoSubSalida: number;
    nombre_subSalida: string;
}
