export interface ResultadoPropiedades {
    ok: boolean;
    data: Propiedad[];
}

export interface Propiedad {
    id_propiedad: number;
    id_externo: number;
    id_irs: number | null;
    id_usuario: number | null;
    id_comuna: number;
    street: string;
    webAddress: string;
    sale: boolean;
    rent: boolean;
    priceSale: number;
    priceRent: number;
    idCurrencySale: number;
    idCurrencyRent: number;
    propertyTitle: string;
    unit: number;
    role: string;
    caracteristicas: Caracteristicas[];
    observations: string;
    featured: boolean;
    onWeb: boolean;
}

export interface Caracteristicas {
    suites: number;
    serviceRoom: boolean;
    jacuzzi: boolean;
    livingRooms: number;
    terraceSurface: number;
    orientation: string;
    constructionYear: number;
    floors: number;
    petsAllowed: boolean;
    typeHeating: string;
    tennisCourt: boolean;
    pool: boolean;
    automaticGate: boolean;
    withGatedCommunity?: boolean;
    warehouses: number;
    contactSchedule?: string;
    alarm: boolean;
    hasNaturalGas?: boolean;
    hasTelephoneLine?: boolean;
    onlyFamilies?: boolean;
    hasBalcony?: boolean;
    bathroomVisit: boolean;
    hasCloset?: boolean;
    kitchen: boolean;
    hasDinningRoom?: boolean;
    hasStudy?: boolean;
    jardinFormado: boolean;
    hasAttic?: boolean;
    hasGrill?: boolean;
    yard?: boolean;
    gameRoom: boolean;
    hasTerrace?: boolean;
    walkinCloset: boolean;
    hasInternetAccess?: boolean;
    hasAirConditioning?: boolean;
    indoorBasketballCourt: boolean;
    hasPaddleCourt?: boolean;
    chimney: boolean;
    hasSecurity?: boolean;
    gym: boolean;
    withLaundryConnection?: boolean;
}

export interface ResultadoObtenerCaracteristicasPropiedad {
    ok: boolean;
    data: Caracteristicas[];
}

export interface ResultadoObtenerDocumentosPropiedad {
    ok: boolean;
    data: ObtenerTodosDocumentosPropiedad[];
}
export interface ObtenerTodosDocumentosPropiedad {
    path: string;
    nom_documento: string;
    id_documento: number;
}

export interface ResultadoPropiedadDocumentoAgregarEliminar {
    ok: boolean;
    data: { mensaje: string };
}

export interface ResultadoObtenerBitacoraPropiedad {
    ok: boolean;
    data: BitacoraPropiedad[];
}

export interface BitacoraPropiedad {
    id_bitacora: number;
    id_propiedad: number;
    id_usuario: number;
    id_usuario_convecta: number;
    observacion_bitacora: string;
    respuesta_bitacora: string;
    fecha_bitacora: string;
    usuario: { nombre_ejecutivo: string };
    semana: number;
}

export interface ResultadoPropiedadBitacoraAgregarEliminar {
    ok: boolean;
    data: { mensaje: string };
}
