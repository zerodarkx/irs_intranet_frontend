export interface ITipoImagen {
    id_tipoImagen: number;
    nombre_tipoImagen: string;
}

export interface ResultadoTipoImagenes {
    ok: boolean;
    data: ITipoImagen[];
}

export interface ResultadoAccionesTipoImagenes{
    ok: boolean;
    data: AccionesTipoTipoImagenes
}

export interface AccionesTipoTipoImagenes {
    mensaje: string;
    titulo: string;
    icono: string;
}