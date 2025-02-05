export interface ResultadoGestionSalidas {
    ok: boolean;
    data: GestionSalidas[];
}

export interface GestionSalidas {
    id_gestion: number;
    id_cliente: number;
    id_ejecutivo: number;
    comentario: string;
    fecha_comentario: Date;
    tipo_accion: string;
    usuario: { nombre_ejecutivo: string }
}