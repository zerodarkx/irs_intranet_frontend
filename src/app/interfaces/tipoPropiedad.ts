export interface ResultadoObtenerTodosTipoPropiedad {
    ok:   boolean;
    data: TipoPropiedad[];
}

export interface TipoPropiedad {
    id_tipoPropiedad:     number;
    nombre_tipoPropiedad: string;
}

export interface ResultadoAccionesTipoPropiedad{
    ok: boolean;
    data: AccionesTipoTipoPropiedad
}

export interface AccionesTipoTipoPropiedad {
    mensaje: string;
    titulo: string;
    icono: string;
}