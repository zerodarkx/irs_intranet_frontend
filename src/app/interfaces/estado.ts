export interface ResultadoObtenerEstados{
    ok: boolean;
    data: Estados[]
}

export interface Estados{
    id_estado: number;
    nombre_estado: string;
    det_estado: string;
}