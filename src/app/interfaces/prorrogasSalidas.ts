export interface dataPreviaProrroga {
    fecha_contrato: Date,
    valor_contrato: number,
    valor_contrato_ant: number
}

export interface ResultadoObtenerProrroga {
    ok: boolean;
    data: Prorroga[];
}
export interface Prorroga {
    id_prorroga: number;
    id_cliente: number;
    id_usuario: number;
    estado: boolean;
    fechaCurseActual: Date;
    fechaVencimientoActual: Date;
    saldoCapital: number;
    abonoCapital: number;
    saldoCapitalActualizado: number;
    mesesProrroga: number;
    fechaNuevaVencimiento: Date;
    valorUfHoy: number;
    comisionEnPesos: number;
    comisionEnPorcentaje: number;
    seguroValorAnual: number;
    seguroCantidadMeses: number;
    seguroValorMensual: number;
    contribucinesValorAnual: number;
    contribucionesCantidadMeses: number;
    contribucionesValorMensual: number;
    rentasValorEnPesos: number;
    fechaFirmaCurse: Date;
    valorUfFechaCurse: number;
    valorRentaCurse: number;
    valorTasaContrato: number;
    valorTasaCliente: number;
    sobretasaMensual: number;
    sobretasaProrroga: number;
    gastosOperacionales: number;
    gastosLegales: number;
    usuario: { nombre_ejecutivo: string }
}

export interface ResultadoAgregarProrroga {
    ok: boolean;
    mensaje: string;
    data: AgregarProrroga;
}

export interface AgregarProrroga {
    id_prorroga: number;
    id_cliente: number;
    id_usuario: number;
    estado: boolean;
    fechaCurseActual: Date;
    fechaVencimientoActual: Date;
    saldoCapital: number;
    abonoCapital: number;
    saldoCapitalActualizado: number;
    mesesProrroga: number;
    fechaNuevaVencimiento: Date;
    valorUfHoy: number;
    comisionEnPesos: number;
    comisionEnPorcentaje: number;
    seguroValorAnual: number;
    seguroCantidadMeses: number;
    seguroValorMensual: number;
    contribucinesValorAnual: number;
    contribucionesCantidadMeses: number;
    contribucionesValorMensual: number;
    rentasValorEnPesos: number;
    fechaFirmaCurse: Date;
    valorUfFechaCurse: number;
    valorRentaCurse: number;
    valorTasaContrato: number;
    valorTasaCliente: number;
    sobretasaMensual: number;
    sobretasaProrroga: number;
    gastosOperacionales: number;
    gastosLegales: number;
}