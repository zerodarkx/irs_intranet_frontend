export interface ResultadoObtenerTodasRegiones {
    ok:   boolean;
    data: Iregiones[];
}

export interface Iregiones {
    id_region:     number;
    id_pais:       number;
    nombre_region: string;
}