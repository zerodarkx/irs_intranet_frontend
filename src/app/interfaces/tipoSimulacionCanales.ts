export interface ITipoCanales {
    id_canal: number;
    nombre_canal: string;
    comision_canal: string;
    renta_mensual: string;
    det_canalSimulacion: string;
}

export interface ResultadoCanalesSimulacion {
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

export interface ResultadoAccionesCanalSimulacion{
    ok: boolean;
    data: AccionesCanalSimulacion
}

export interface AccionesCanalSimulacion {
    mensaje: string;
    titulo: string;
    icono: string;
}
