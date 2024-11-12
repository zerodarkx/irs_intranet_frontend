export interface ResultadoAuthLogin {
    ok: boolean;
    token: string;
}

export interface FormularioLogin{
    usuario: string;
    password: string;
}

export interface ValidarSession{
    ok: boolean
}