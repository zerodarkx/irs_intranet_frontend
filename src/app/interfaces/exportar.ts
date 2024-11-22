export interface exportarPdf{
    ok: boolean;
    archivo: archivoBufer;
    nombre_archivo: string;
}

export interface archivoBufer{
    type: string;
    data: number[]
}