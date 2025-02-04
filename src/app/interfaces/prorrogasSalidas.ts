export interface dataPreviaProrroga {
    fecha_contrato: Date,
    valor_contrato: number,
    valor_contrato_ant: number
}

export interface ResultadoObtenerProrroga {
    ok: boolean;
    data: ObtenerProrroga[];
}
export interface ObtenerProrroga {
    id_prorroga: number;
    id_cliente: number;
    id_usuario: number;
    pagada: string;
    cantidad_meses: number;
    abono: string;
    porcentaje: number;
    monto_contrato: number;
    monto_contrato_ant: number;
    fecha_vencimiento: Date;
    usuario: { nombre_ejecutivo: string }
}

export interface ResultadoAgregarProrroga {
    ok: boolean;
    mensaje: string;
    data: AgregarProrroga;
}

export interface AgregarProrroga {
    pagada: string;
    cantidad_meses: number;
    abono: string;
    porcentaje: number;
    monto_contrato: number;
    monto_contrato_ant: number;
    fecha_vencimiento: Date;
}