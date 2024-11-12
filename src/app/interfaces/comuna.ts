export interface ResultadoObtenerComunas {
    ok:   boolean;
    data: Comuna[];
}

export interface Comuna {
    id_comuna:     number;
    id_region:     number;
    nombre_comuna: string;
}
