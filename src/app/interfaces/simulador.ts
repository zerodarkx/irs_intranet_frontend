export interface ISimulador {
    id_simulacion: number;
    id_cliente: number;
    id_ejecutivo: number;
    id_canal?: number;
    id_banco?: number;
    moneda: string;
    valor_comercial: string;
    valor_contrato: string;
    descuento: string;
    plazo_total: number;
    plazo_prepago: number;
    comision: string;
    deuda_hipotecaria: string;
    contribuciones: string;
    gastos_operacionales: string;
    renta_mensual: string;
    cae: string;
    liquido_cliente: string;
    obs: null | string;
    fecha_simulacion: Date;
    nombreEjecutivo?: string;
    activo?: boolean;
    banco?: string;
    canal?: string;
}

export interface ResultadoObtenerTodasSimulacionPorCliente {
    ok: boolean;
    data: ISimulador[];
}

export interface ResultadoObtenerSimulacionPorCliente {
    ok: boolean;
    data: ISimulador;
}
export interface ResultadoCrearSimulacion {
    ok: boolean;
    data: Data;
}

export interface Data {
    mensaje: string;
}





