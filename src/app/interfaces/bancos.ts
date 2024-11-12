export interface IBancos {
    id_banco:     number;
    nombre_banco: string;
}

export interface ResultadoTodosBancos {
    ok:   boolean;
    data: IBancos[];
}
