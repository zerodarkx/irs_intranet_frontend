export interface ITipoCanales {
    id_canal: number;
    nombre_canal: string;
    comision_canal: string;
    renta_mensual: string;
    det_canalSimulacion: string;
}

export interface ResultadoTipoClientesTodos {
    ok: boolean;
    data: ITipoCanales[];
}


export interface ResultadoComisionTasaByID {
    tipoCanales: TipoCanales;
}

export interface TipoCanales {
    comision_canal: string;
    renta_mensual: string;
}
