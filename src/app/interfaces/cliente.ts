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
    id_ejecutivo: null;
    id_inversionista: null;
    id_tipoPropiedad: number;
    id_codigo_telefono: number;
    id_canal: null;
    id_estado: null;
    id_lineaNegocio: null;
    id_comuna: number;
    id_plataforma: number;
    cli_rut: string;
    cli_nombre: string;
    cli_telefono: string;
    cli_correo: string;
    cli_direccion: string;
    cli_obs: string;
    rol: null;
    cli_deuda_estimada: string;
    cli_valor_comercial: string;
    mConstruidos: string;
    mTerreno: string;
    cli_fecha_ingreso: Date;
    cli_fecha_contacto: null;
    motivo_rechazo: null;
    tipo_salida: null;
    id_region: number;
    nombre_estado: string;
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
}

export interface ResultadoCambiarEstado {
    ok: boolean;
    data: CambiarEstado;
}

export interface CambiarEstado {
    mensaje: string;
    titulo: string;
    estado?: string;
}
