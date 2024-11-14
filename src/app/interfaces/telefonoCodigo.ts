export interface ResultadoObtenerTodosCodigoTelefono {
    ok: boolean;
    data: CodigoTelefono[]
}

export interface CodigoTelefono {
    id_codigoTelefonico: number;
    codigo_telefono: string;
}