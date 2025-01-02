import { IconoSweetAlert } from "../shared/utils/sweetAlert";

export interface ResultadoSubirDocumentoImagen {
    ok: boolean;
    data: Data;
}

export interface Data {
    mensaje: string;
}

export interface ResultadoObtenerTodosDocumentosCliente {
    ok: boolean;
    data: DataObtenerTodosDocumentosCliente[];
}

export interface DataObtenerTodosDocumentosCliente {
    path: string;
    nom_documento: string;
    id_documento: number;
}

export interface ResultadoObtenerTodosImagenCliente {
    ok: boolean;
    data: DataObtenerTodosImagenCliente[];
}

export interface DataObtenerTodosImagenCliente {
    path: string;
    nom_imagen: string;
    id_imagen: number;
}

export interface ResultadoObtenerEjecutivoYbroker {
    ok: boolean;
    data: nombreApellidoEjecutivoId[];
}

export interface nombreApellidoEjecutivoId {
    id_usuario: number;
    nombre_ejecutivo: string;
}

export interface ResultadoCrearCliente {
    ok: boolean;
    data: DataCrearCliente;
}

export interface DataCrearCliente {
    mensaje: string;
    id_cliente: number;
}

export interface ResultadoObtenerClienteById {
    ok: boolean;
    data: ClienteById;
}

export interface ClienteById {
    id_cliente: number;
    id_ejecutivo: number;
    id_inversionista: number;
    id_tipoPropiedad: number;
    id_codigo_telefono: number;
    id_canal: number;
    id_estado: number;
    id_lineaNegocio: number;
    id_comuna: number;
    id_plataforma: number;
    cli_rut: string;
    cli_nombre: string;
    cli_telefono: string;
    cli_correo: string;
    cli_direccion: string;
    cli_obs: string;
    rol: string;
    cli_deuda_estimada: string;
    cli_valor_comercial: string;
    mConstruidos: string;
    mTerreno: string;
    cli_fecha_ingreso: Date;
    cli_fecha_contacto: Date;
    motivo_rechazo: string;
    tipo_salida: string;
    id_region: number;
    nombre_estado: string;
    inversionista: string;
}

export interface ResultadoGestionCliente {
    ok: boolean;
    data: GestionCliente[];
}

export interface GestionCliente {
    id_gestion: number;
    id_cliente: number;
    id_ejecutivo: number;
    comentario: string;
    fecha_comentario: Date;
    tipo_accion: string;
    nombre_ejecutivo: string;
}

export interface ResultadoAgregarGestionCliente {
    ok: boolean;
    data: ResultadoMensaje;
}

export interface ResultadoMensaje {
    mensaje: string;
    titulo: string;
    icono: IconoSweetAlert;
}

export interface ResultadoObtenerTodosClientes {
    ok: boolean;
    data: TodosClientes[];
}

export interface TodosClientes {
    id: number;
    nom_cli: string;
    propiedad: number;
    com: string;
    dEst: number;
    vCom: number;
    nombre_ejecutivo: string
    origen: string;
    canal: string;
    reserva_r: string;
    reserva_i: string;
    id_estado: number;
    estado: string;
    det_estado: string;
    fec_ingreso: Date;
    fec_contacto: Date;
    nombre_inversionista: string;
}

export interface ResultadoCambiarEstado {
    ok: boolean;
    data: CambiarEstado;
}

export interface CambiarEstado {
    mensaje: string;
    titulo: string;
    estado?: string;
    id_estado?: number;
}

export interface GastoClienteTipo {
    clave: string;
    titulo: string;
    data: CategoriaGastoCliente[];
    total: string;
}

export interface ResultadoObtenerGastoCliente {
    ok: boolean;
    data: DataResultadoGastoCLiente
}

export interface DataResultadoGastoCLiente {
    id_gasto: number;
    id_cliente: number;
    total_gasto: number;
    total_favor: number;
    abonos: CategoriaGastoCliente[];
    tasacion: CategoriaGastoCliente[];
    seguros: CategoriaGastoCliente[];
    conservador: CategoriaGastoCliente[];
    notaria: CategoriaGastoCliente[];
    abogados: CategoriaGastoCliente[];
    contribuciones: CategoriaGastoCliente[];
    otros: CategoriaGastoCliente[];
}

export interface CategoriaGastoCliente {
    tipo: string;
    monto: string;
    fecha: string;
}

export interface ResultadoObtenerDocumentosCurse {
    ok: boolean;
    data: DocumentosCurse[];
}

export interface DocumentosCurse {
    id_documentoCurse: number;
    id_cliente: number;
    id_usuario: number;
    id_documento: number;
    moneda: string;
    monto: number;
    tipo_cuota: string;
    cuotas: number;
    fecha_contrato: Date;
    fecha_termino: Date;
    fecha_vencimiento: Date;
    ruta_documento: string;
    fecha_ingreso: Date;
    usuario: string;
    nombre_tipoDocumento: string;
}

export interface ResultadoNuevoDocumentoCurse {
    ok: boolean
    data: Data
}


export interface ResultadoObtenerReservasClientes {
    ok: boolean;
    data: ReservasClientes[];
}

export interface ReservasClientes {
    inv_cli: number;
    inv_res: number;
    tir: number;
    nombre_estado: string;
    nombre_inversionista: string;
    ltv: number;
    valor_contrato: number;
}

export interface ResultadoObtenerFechaCursado {
    ok: true;
    data: ObtenerFechaCursado;
}

export interface ObtenerFechaCursado {
    fecha_cursado_inicio: Date;
    fecha_cursado_termino: Date;
}

export interface ResultadoRechazarCliente{
    ok: boolean;
    data: MensajeRechazado
}

export interface MensajeRechazado{
    mensaje: string;
}