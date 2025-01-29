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
    usuario: UsuarioBitacoras;
}

export interface UsuarioBitacoras {
    nombre_ejecutivo: string;
}

export interface ResultadoCrearEditarEliminarBitacora {
    ok: boolean;
    mensaje: string;
}