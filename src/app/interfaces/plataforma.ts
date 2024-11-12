export interface ResultadoObtenerTodasPlataformas {
    ok:   boolean;
    data: Plataforma[];
}

export interface Plataforma {
    id_plataforma:     number;
    nombre_plataforma: string;
    logo_plataforma:   string;
}
