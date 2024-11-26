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

export interface DataResultadoGastoCLiente{
    id_gasto:       number;
    id_cliente:     number;
    total_gasto:    number;
    total_favor:    number;
    abonos:         CategoriaGastoCliente[];
    tasacion:       CategoriaGastoCliente[];
    seguros:        CategoriaGastoCliente[];
    conservador:    CategoriaGastoCliente[];
    notaria:        CategoriaGastoCliente[];
    abogados:       CategoriaGastoCliente[];
    contribuciones: CategoriaGastoCliente[];
    otros:          CategoriaGastoCliente[];
}

// export interface GastoCliente {
//     id_gasto: number;
//     id_cliente: number;
//     cat_abonos_tipo: string[]
//     cat_tasacion_tipo: string[];
//     cat_seguros_tipo: string[];
//     cat_escritura_tipo: string[];
//     cat_notaria_tipo: string[];
//     cat_abogados_tipo: string[];
//     cat_contribuciones_tipo: string[];
//     cat_otros_tipo: string[];
//     cat_abonos_fecha: string[]
//     cat_tasacion_fecha: string[];
//     cat_seguros_fecha: string[];
//     cat_escritura_fecha: string[];
//     cat_notaria_fecha: string[];
//     cat_abogados_fecha: string[];
//     cat_contribuciones_fecha: string[];
//     cat_otros_fecha: string[];
//     cat_abonos_monto: string[]
//     cat_tasacion_monto: string[];
//     cat_seguros_monto: string[];
//     cat_escritura_monto: string[];
//     cat_notaria_monto: string[];
//     cat_abogados_monto: string[];
//     cat_contribuciones_monto: string[];
//     cat_otros_monto: string[];
//     // tasasion: CategoriaGastoCliente[];
//     // [key: string]: any;
// }

export interface CategoriaGastoCliente {
    tipo: string;
    monto: string;
    fecha: string;
}
