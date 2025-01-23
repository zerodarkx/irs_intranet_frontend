export interface ResultadoObtenerTodosUsuario {
    ok: boolean;
    data: ResultadoUsuario[];
}

export interface ResultadoUsuario {
    id_usuario: number;
    rut: string;
    nom: string;
    apep: string;
    apem: string;
    email: string;
    telefono: string;
    activo: boolean;
    id_plataforma: number;
    nombreCompleto: string;
    id_perfil: number;
    perfil: string;
    id_codigoTelefonico: number;
    nombre_plataforma: string;
    id_jefatura: number;
    permisos: PermisosModulo[];
}

export interface ResultadoAccionesUsuario {
    ok: boolean;
    data: AccionesUsuario
}

export interface AccionesUsuario {
    mensaje: string;
    titulo: string;
    icono: string;
}

export interface ResultadoObtenerSelectInversionistaDisponibles {
    ok: boolean;
    data: SelectInversionistaDisponibles[];
}

export interface SelectInversionistaDisponibles {
    id_inv: number;
    inv: string;
}

export interface PermisosModulo {
    nombre: string;
    categorias?: PermisosCategoria[];
    activo: boolean;
    permiso: string;
}

export interface PermisosCategoria {
    nombre: string;
    subcategorias?: PermisosSubCategoria[];
    activo: boolean;
    permiso: string;
}
export interface PermisosSubCategoria {
    nombre: string;
    activo: boolean;
    permiso: string;
}

export interface PermisoConId {
    id: number;
    permisos: PermisosModulo[];
}

// export interface ResultadoObtenerDataInversionista {
//     ok: true;
//     data: obtenerDataInversionista
// }

// export interface obtenerDataInversionista {
//     id_inversionista: number;
//     monto_invertir_desde: number;
//     monto_invertir_hasta: number;
//     ltv_desde: number;
//     ltv_hasta: number;
//     plazo_desde: number;
//     plazo_hasta: number;
//     tir: number;
//     propiedades: any;
//     documentos: number[]
// }

export interface ResultadoGuardarDataInversionista {
    ok: true;
    data: GuardarDataInversionista
}

export interface GuardarDataInversionista {
    mensaje: string;
}