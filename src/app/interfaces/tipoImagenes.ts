export interface ITipoImagen {
    id_tipoImagen: number;
    nombre_tipoImagen: string;
}

export interface ResultadoTipoImagenes {
    ok: boolean;
    data: ITipoImagen[];
}
