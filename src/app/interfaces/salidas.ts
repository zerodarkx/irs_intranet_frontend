export interface ResultadoObtenerClienteDetalle {
    ok: boolean;
    data: ClienteSalidaDetalle;
}

export interface ClienteSalidaDetalle {
    id_cliente: number;
    rut: string;
    nombre: string;
    correo: string;
    fecha_cursado_inicio: Date;
    fecha_cursado_termino: Date;
    fecha_cliente_termino: Date;
    direccion: string;
    telefono: string;
    ejecutivo: string;
    inversionista: string;
    valor_comercial: number;
    valor_contrato: number;
    ltv: number;
    region: string;
    comuna: string;
    tipo_salida: number;
    tipo_subSalida: number;
}

export interface ResultadoObtenerClientesSalida {
    ok: boolean;
    data: ClientesSalida[];
}

export interface ClientesSalida {
    id_cliente: number;
    nombre: string;
    fecha_cursado_inicio: Date;
    fecha_cursado_termino: Date;
    fecha_cliente_termino: Date;
    direccion: string;
    telefono: string;
    ejecutivo: string;
    inversionista: string;
    comuna: string;
    region: string;
    valor_comercial: number;
    valor_contrato: number;
    tipo_salida: string;
    tipo_subSalida: string;

}