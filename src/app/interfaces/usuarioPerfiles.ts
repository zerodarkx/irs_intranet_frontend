export interface ResultadoObtenerTodosPerfiles{
    ok: boolean;
    data: TipoPerfilUsuario[]
}

export interface TipoPerfilUsuario{
    id_tipoUsuario:          number;
    nombre_tipoUsuario:      string;
    descripcion_tipoUsuario: string;
}

export interface ResultadoAccionesPerfil{
    ok: boolean;
    data: AccionesTipoPerfil
}

export interface AccionesTipoPerfil {
    mensaje: string;
    titulo: string;
    icono: string;
}