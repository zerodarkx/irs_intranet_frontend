export interface ResultadoObtenerGraficosEjecutivo {
    ok: boolean;
    data: ObtenerGraficosEjecutivo;
}

export interface ObtenerGraficosEjecutivo {
    propiedad: Propiedad;
    mensuales: Mensuales;
    historico: Historico;
}

export interface Historico {
    contadorPorcasosTotales: ContadorPor[];
    titulo: string;
}

export interface Mensuales {
    contadorPorCasosMensuales: ContadorPor[];
    titulo: string;
}

export interface Propiedad {
    contadorPorPropiedad: ContadorPor[];
    titulo: string;
}

export interface ContadorPor {
    cant: number;
    leyenda: string;
    suma?: number;
}

export interface ResultadoObtenerGraficosInversionista {
    ok: boolean;
    data: Data;
}

export interface Data {
    casosPendientes: CasosPendientes;
    casosSaldos: DataSalDos;
}

export interface CasosPendientes {
    dataPendiente: ContadorPor[];
    titulo: string;
}
export interface DataSalDos {
    dataSaldos: ContadorPor[];
    titulo: string;
}
