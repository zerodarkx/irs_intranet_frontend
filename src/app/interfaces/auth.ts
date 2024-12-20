import { PermisosModulo } from "./usuario";

export interface ResultadoAuthLogin {
    ok: boolean;
    token: string;
    permisos_usuario: string[];
}

export interface FormularioLogin {
    usuario: string;
    password: string;
}

export interface ValidarSession {
    ok: boolean
}

export interface Payload {
    id_usuario: number;
    perfil: number;
    permisos: string;
    nombre: string;
    exp: number;
}