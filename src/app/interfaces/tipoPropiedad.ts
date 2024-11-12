export interface ResultadoObtenerTodosTipoPropiedad {
    ok:   boolean;
    data: TipoPropiedad[];
}

export interface TipoPropiedad {
    id_tipoPropiedad:     number;
    nombre_tipoPropiedad: string;
}
