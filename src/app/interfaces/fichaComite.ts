export interface ResultadoObtenerFichaComite {
    ok: boolean;
    data: FichaComite;
}

export interface FichaComite {
    id_fichaComite: number;
    id_cliente: number;
    nom_cliente: string;
    rut: string;
    profesion: null;
    direccion: string;
    id_comuna: number;
    telefono: number;
    tel_empresa: number;
    email: string;
    web: string;
    resena_cliente: string;
    nom_compania: string;
    rut_empresa: string;
    participacion_empresa: string;
    giro_empresa: string;
    desResCli: string;
    desNesOpe: string;
    desComReaCom: string;
    desComReaCom_obs: string;
    desComentario: string;
    perInfCom: string;
    perInfCom_cant: string;
    perInfCom_monto: string;
    perInfCom_obs: string;
    perdeu: string;
    perdeu_est: string;
    perdeu_obs: string;
    percip: string;
    percip_obs: string;
    percerdeuhip: string;
    percerdeuhip_cant: string;
    percerdeuhip_obs: string;
    percerdeucon: string;
    percerdeucon_cant: string;
    percerdeucon_obs: string;
    perinflegal: string;
    perinflegal_tip: string;
    perinflegal_cant: string;
    perinflegal_obs: string;
    cominfcom: string;
    cominfcom_cant: number;
    cominfcom_monto: string;
    cominfcom_obs: string;
    comdeu: string;
    comdeu_est: string;
    comdeu_obs: string;
    comcip: string;
    comcip_obs: string;
    comcerdeuhip: string;
    comcerdeuhip_cant: number;
    comcerdeuhip_obs: string;
    comcerdeucontr: string;
    comcerdeucontr_cant: number;
    comcerdeucontr_obs: string;
    cominfper: string;
    cominfper_tip: string;
    cominfper_cant: string;
    cominfper_obs: string;
    destinoSII: string;
    tipoInmueble: string;
    estaBodega: string;
    id_tasador: number;
    fechaTasacion: Date;
    detprositlegpro: string;
    detprositlegpro_banco: number;
    situacionLegalPro: string;
    id_tipoConstruccion: number;
    regularizacion: string;
    quienViveInmueble: string;
    quienViveInmueble_obs: string;
    terrenoEstimado_uf: number;
    terrenoEstimado_m2: number;
    cinstruccionEstimado_uf: number;
    cinstruccionEstimado_m2: number;
    propiedadEstimado_uf: number;
    precioLiquidacion: string;
    liquidador_vms: string;
    liquidador_valoresperado: string;
    avaluoFiscal: string;
    velocidadVenta: string;
    valor_uf: string;
    ltv: string;
    compraventa: number;
    renta_anual: number;
    gastos_operacionales: number;
    alzamiento: number;
    administracion: number;
    contribuciones: number;
    provicion_contribuciones: number;
    liquido_cliente: number;
    tasa: number;
    id_region: number;
    comision: number;
}

export interface ResultadoGuardarFichaComite {
    ok: boolean;
    data: GuardarFichaComite
}

export interface GuardarFichaComite {
    icono: string;
    titulo: string;
    mensaje: string;
    id_fichaComite: number;
}