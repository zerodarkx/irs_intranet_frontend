export interface ResultadoObtenerTodasBitacoras {
    ok: boolean,
    data: TodasBitacoras[]
}

export interface TodasBitacoras {
    id_bitacora: number;
    id_cliente: number;
    id_usuario: number;
    comentario: string;
    fecha_ingresado: Date;
    semana: number;
    usuario: { nombre_ejecutivo: string }
}

export interface ResultadoCrearEditarEliminarBitacora {
    ok: boolean;
    mensaje: string;
}