export interface TipoCanalContacto {
    id_canal: number;
    nombre_canal: string;
    estado: boolean;
}

export interface ResultadoTipoCanalContacto {
    ok: boolean;
    data: TipoCanalContacto[];
}

export interface ResultadoAccionTipoCanalContacto {
    ok: boolean;
    data: AccionesTipoCanalContacto
}

export interface AccionesTipoCanalContacto {
    mensaje: string;
    titulo: string;
    icono: string;
}