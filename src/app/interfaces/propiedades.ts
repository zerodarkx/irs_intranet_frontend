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