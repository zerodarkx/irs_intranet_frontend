export interface ResultadoObtenerTodosInversionesContador {
    ok: boolean;
    data: InversionesContador;
}

export interface InversionesContador {
    Rechazado: DataContador;
    Desistido: DataContador;
    Cursado: DataContador;
    Comite: DataContador;
    PreAprobado: DataContador;
    Aprobado: DataContador;
    Pendiente: DataContador;
}

export interface DataContador {
    cantidad: number;
    estado: number;
    titulo: string;
    montoTotal: number;
}

export interface ResultadoObtenerTodosInversionesPorEstado {
    ok: boolean;
    data: ObtenerTodosInversionesPorEstado[];
}

export interface ObtenerTodosInversionesPorEstado {
    id: number;
    nom_cli: string;
    propiedad: string;
    comuna: string;
    v_comercial: number;
    v_contrato: number;
    m_invertir: number;
    ltv: number;
    tir: number;
    id_reserva: number;
    id_inversionista: number;
    inversionista: string;
    estado: string;
    ejecutivo: string;
}

export interface ResultadoObtenerDataInversionista {
    ok: boolean;
    data: DataInversionista;
}

export interface DataInversionista {
    id_inversionista: number;
    monto_invertir_desde: number;
    monto_invertir_hasta: number;
    ltv_desde: number;
    ltv_hasta: number;
    plazo_desde: number;
    plazo_hasta: number;
    tir: number;
    propiedades: number[];
    documentos: number[];
}

export interface ResultadoAgregarCasoNuevoReserva {
    ok: boolean;
    mensaje: string;
}

export interface ResultadoobtenerComentarioPorInversionista{
    ok:boolean;
    data: obtenerComentarioPorInversionista[]
}

export interface obtenerComentarioPorInversionista{
    comentario: string;
    fecha: Date;
}

export interface ResultadoagregarComentarioPorInversionista{
    ok: boolean;
    mensaje: string;
}

export interface ResultadoObtenerDocumentosPorInversionista{
    ok: boolean;
    data: DocumentosPorInversionista[]
}

export interface DocumentosPorInversionista{
    nom_documento: string;
    path: string;
}