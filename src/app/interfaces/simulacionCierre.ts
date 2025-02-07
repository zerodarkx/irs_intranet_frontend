export interface ResultadoObtenerSimulacionCierre {
    ok: boolean;
    data: ObtenerSimulacionCierre
}

export interface ObtenerSimulacionCierre {
    id_simulacionCierre: number
    id_cliente: number,
    administracion: number,
    administracion2: number,
    comision: number,
    contribuciones: number,
    costo_anual: number,
    descuento: number,
    deuda_hipotecaria: number,
    gastos_operacionales: number,
    porc_compraventa: number,
    provision_contribucion: number,
    renta_mensual: number,
    valorFavorCliente: number,
    valor_comercial: number,
    valor_compra_venta: number,
    valor_contrato: number,
    liquido_cliente: number,
    observaciones: string,
    fecha: Date,
    t_simulacion: string,
    t_valor_comercial: string,
    t_valor_compraventa: string,
    t_afavor: string,
    t_toma: string,
    t_tasa: string,
    t_deuda_bruta: string,
    t_renta: string,
    t_admin1: string,
    t_admin2: string,
    t_gastos: string,
    t_alzamiento: string,
    t_contribuciones: string,
    t_provision: string,
    t_liquido: string
}

export interface ResultadoGuardarSimulacionCierre {
    ok: boolean;
    data: GuardarSimulacionCierre
}

export interface GuardarSimulacionCierre {
    icono: string;
    titulo: string;
    mensaje: string;
    id_simulacionCierre: number;
}